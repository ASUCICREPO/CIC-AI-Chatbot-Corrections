#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================================${NC}"
echo -e "${GREEN}Amazon Q Business with Web Crawler - Deployment Script${NC}"
echo -e "${BLUE}===========================================================${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if CDK is installed
if ! command -v npx cdk &> /dev/null; then
    echo -e "${RED}Error: AWS CDK is not installed. Please install it first with 'npm install -g aws-cdk'.${NC}"
    exit 1
fi

# Prompt for AWS Identity Center Instance ARN
echo -e "${YELLOW}Please enter your AWS Identity Center Instance ARN${NC}"
echo -e "${BLUE}(Format: arn:aws:sso:::instance/ssoins-xxxxxxxxxx)${NC}"
read -p "ARN: " identity_center_arn

# Basic ARN validation - very permissive
if [[ ! $identity_center_arn =~ ^arn:.*:sso:::instance/.+ ]]; then
    echo -e "${RED}Error: The ARN doesn't appear to be an Identity Center ARN.${NC}"
    echo -e "${YELLOW}It should start with 'arn:' and contain ':sso:::instance/'${NC}"
    exit 1
fi

# Warning about potential format issues but allow to continue
echo -e "${YELLOW}Using ARN: ${identity_center_arn}${NC}"
echo -e "${YELLOW}Note: If deployment fails due to ARN format, you may need to verify the exact ARN format in the AWS Console.${NC}"

# Prompt for seed URLs
echo -e "${YELLOW}Please enter the seed URLs for the web crawler (one per line)${NC}"
echo -e "${BLUE}Enter an empty line when done${NC}"

urls=()
while true; do
    read -p "URL (or empty to finish): " url
    if [ -z "$url" ]; then
        break
    fi
    
    # Basic URL validation
    if [[ ! $url =~ ^https?:// ]]; then
        echo -e "${RED}Warning: URL should start with http:// or https://${NC}"
        echo -e "${YELLOW}Do you want to add http:// prefix? (y/n)${NC}"
        read -p "> " add_prefix
        if [[ $add_prefix == "y" || $add_prefix == "Y" ]]; then
            url="http://$url"
        fi
    fi
    
    urls+=("$url")
done

# Check if at least one URL was provided
if [ ${#urls[@]} -eq 0 ]; then
    echo -e "${RED}Error: At least one seed URL is required.${NC}"
    exit 1
fi
# Generate the TypeScript file content
echo -e "${YELLOW}Generating configuration file...${NC}"

# Create the URLs string
url_string=""
for ((i=0; i<${#urls[@]}; i++)); do
    url_string+="    '${urls[$i]}'"
    if [ $i -lt $((${#urls[@]}-1)) ]; then
        url_string+=",\n"
    fi
done

# Create the complete TypeScript file content
ts_content=$(cat <<EOF
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmazonQBusinessStack } from '../lib/amazon-q-business-stack';

const app = new cdk.App();

new AmazonQBusinessStack(app, 'AmazonQBusinessStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  terminationProtection: false,
  description: 'Amazon Q Business stack with web crawler data source',
  identityCenterInstanceArn: '${identity_center_arn}',
  seedUrls: [
${url_string}
  ],
});
EOF
)

# Write the content to the file
echo -e "$ts_content" > bin/amazon-q-app.ts

echo -e "${GREEN}Configuration updated successfully!${NC}"

# Ask if user wants to bootstrap the environment
echo -e "${YELLOW}Do you want to bootstrap your AWS environment? (Required for first-time CDK deployment)${NC}"
echo -e "${BLUE}This is only needed once per AWS account/region.${NC}"
read -p "Bootstrap? (y/n): " bootstrap_choice

if [[ $bootstrap_choice == "y" || $bootstrap_choice == "Y" ]]; then
    echo -e "${YELLOW}Bootstrapping AWS environment...${NC}"
    npx cdk bootstrap
    if [ $? -ne 0 ]; then
        echo -e "${RED}Bootstrapping failed. Please check the error messages above.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Bootstrapping completed successfully!${NC}"
fi
# Ask if user wants to deploy
echo -e "${YELLOW}Do you want to deploy the stack now?${NC}"
read -p "Deploy? (y/n): " deploy_choice

if [[ $deploy_choice == "y" || $deploy_choice == "Y" ]]; then
    echo -e "${YELLOW}Deploying stack...${NC}"
    npx cdk deploy
    if [ $? -ne 0 ]; then
        echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
        exit 1
    fi
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    
    echo -e "${BLUE}===========================================================${NC}"
    echo -e "${GREEN}Next Steps:${NC}"
    echo -e "${BLUE}===========================================================${NC}"
    echo -e "1. ${YELLOW}Navigate to the Amazon Q Business console${NC}"
    echo -e "2. ${YELLOW}Select your application (CDK_QBusiness_WebCrawler)${NC}"
    echo -e "3. ${YELLOW}Add users and assign subscription types (Pro/Lite)${NC}"
    echo -e "4. ${YELLOW}Enable Advanced Indexing for the web crawler data source${NC}"
    echo -e "5. ${YELLOW}Manually sync the web crawler to start indexing content${NC}"
    echo -e "${BLUE}===========================================================${NC}"
else
    echo -e "${YELLOW}Deployment skipped. You can deploy later using 'npx cdk deploy'.${NC}"
fi

echo -e "${GREEN}Script completed!${NC}"
