# Amazon Q Business with Web Crawler Data Source

This project deploys an Amazon Q Business application with a web crawler data source using AWS Cloud Development Kit (CDK). The solution enables you to create an enterprise search and generative AI assistant that can crawl, index, and retrieve information from specified websites.

## Architecture Overview

This CDK application deploys the following AWS resources:

- **Amazon Q Business Application**: The core Q Business application that provides the generative AI capabilities
- **Amazon Q Business Index**: A starter index to store and search document content
- **Amazon Q Business Retriever**: A native index retriever to search indexed content
- **Amazon Q Business Web Experience**: A web interface for users to interact with the Q Business application
- **Amazon Q Business Web Crawler Data Source**: A web crawler that indexes content from specified seed URLs
- **IAM Roles and Policies**: Necessary permissions for the Q Business services to operate
- **KMS Key**: For encryption of sensitive data

## Prerequisites

Before deploying this solution, you need:

1. **AWS Account**: An active AWS account with appropriate permissions
2. **AWS CLI**: [AWS Command Line Interface](https://aws.amazon.com/cli/) installed
3. **AWS Credentials**: Configured with `aws configure` (see details below)
4. **Node.js**: [Node.js](https://nodejs.org/) v14.x or later
5. **AWS CDK**: Installed globally with `npm install -g aws-cdk`
6. **AWS Identity Center**: Set up and configured with an instance ARN
7. **Seed URLs**: A list of websites you want to crawl and index

### Configuring AWS CLI

Before deploying, you must configure your AWS CLI with appropriate credentials:

```bash
aws configure
```

You'll be prompted to enter:
- **AWS Access Key ID**: Your IAM user access key
- **AWS Secret Access Key**: Your IAM user secret key
- **Default region name**: The AWS region to deploy to (e.g., us-east-1)
- **Default output format**: json (recommended)

Ensure your IAM user or role has permissions to create the following resources:
- Amazon Q Business resources
- IAM roles and policies
- KMS keys
- CloudWatch logs

### Getting Your AWS Identity Center Instance ARN

To find your AWS Identity Center instance ARN:

1. Sign in to the AWS Management Console
2. Navigate to the AWS IAM Identity Center service
3. In the left navigation pane, choose "Settings"
4. Under "Identity source", you'll find your Identity Center ARN in the format:
   `arn:aws:sso:::instance/ssoins-xxxxxxxxxx`
5. Copy this ARN to use in your configuration

The ARN format should be similar to: `arn:aws:sso:::instance/ssoins-1234567890abcdef`

### Preparing Seed URLs

Identify websites you want to crawl and index. Consider the following when selecting URLs:

- **Content Relevance**: Choose websites with content relevant to your users' needs
- **Public Access**: Ensure the websites are publicly accessible
- **Content Volume**: Consider the amount of content to be indexed
- **Update Frequency**: Consider how often the content changes
- **Legal Considerations**: Ensure you have permission to crawl and index the content

Example seed URLs:
```
https://docs.aws.amazon.com/qbusiness/
https://aws.amazon.com/qbusiness/faqs/
https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-q/
```

## Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Update the configuration in `bin/amazon-q-app.ts`:
   - Replace the `identityCenterInstanceArn` with your actual AWS Identity Center instance ARN
   - Update the `seedUrls` array with the websites you want to crawl

## Deployment

### Using the Deployment Script

The easiest way to deploy this application is using the included deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

This interactive script will:
1. Install all required dependencies (npm install)
2. Prompt you for your AWS Identity Center Instance ARN
3. Allow you to enter multiple seed URLs for the web crawler
4. Update the configuration files automatically
5. Offer to bootstrap your AWS environment if needed
6. Deploy the stack to your AWS account

### Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Configure your AWS credentials if not already done:
   ```bash
   aws configure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Bootstrap your AWS environment (only needed once per account/region):
   ```bash
   cdk bootstrap
   ```

4. Deploy the stack:
   ```bash
   cdk deploy
   ```

This will:
1. Compile the TypeScript code
2. Synthesize a CloudFormation template
3. Deploy the stack to your default AWS account and region

You can also run these steps individually:

```bash
# Compile TypeScript to JavaScript
npm run build

# Synthesize CloudFormation template
npm run synth

# Deploy the stack
npm run deploy
```

## Post-Deployment Configuration (AWS Console)

After deploying the stack, you need to perform these additional steps in the AWS Console:

### 1. Add Users to the Q Business Application

1. Navigate to the Amazon Q Business console
2. Select your application (`CDK_QBusiness_WebCrawler`)
3. Go to the "Users and groups" tab
4. Click "Add users" or "Add groups"
5. Search for and select the users/groups you want to add
6. Assign subscription types to each user:
   - **Pro**: Full access to all features including document upload and custom plugins
   - **Lite**: Basic access with limited features
7. Click "Add" to confirm

### 2. Configure Advanced Indexing for Web Crawler

1. Navigate to the Amazon Q Business console
2. Select your application (`CDK_QBusiness_WebCrawler`)
3. Go to the "Data sources" tab
4. Select the "WebCrawlerDataSource" data source
5. Click "Edit"
6. Under "Multimedia content settings", enable "Advanced indexing"
7. Save your changes

### 3. Manually Sync the Web Crawler

The web crawler is configured for on-demand synchronization. To start the initial crawl:

1. Navigate to the Amazon Q Business console
2. Select your application (`CDK_QBusiness_WebCrawler`)
3. Go to the "Data sources" tab
4. Select the "WebCrawlerDataSource" data source
5. Click "Sync now" to start the crawling process
6. Monitor the sync status on the same page

## Configuration Options

The main configuration parameters are defined in `bin/amazon-q-app.ts`:

- **identityCenterInstanceArn**: The ARN of your AWS Identity Center instance
- **seedUrls**: An array of URLs that the web crawler will use as starting points
- **terminationProtection**: Whether to enable termination protection for the CloudFormation stack

Additional web crawler configuration options in `lib/amazon-q-business-stack.ts` include:

- **rateLimit**: Maximum requests per minute (default: 300)
- **maxFileSize**: Maximum file size in MB to crawl (default: 50)
- **crawlDepth**: How many links deep to crawl (default: 2)
- **maxLinksPerUrl**: Maximum links to follow from each URL (default: 100)
- **crawlSubDomain**: Whether to crawl subdomains (default: true)
- **crawlAllDomain**: Whether to crawl all domains (default: false)
- **honorRobots**: Whether to honor robots.txt files (default: false)
- **crawlAttachments**: Whether to crawl and index attachments (default: true)

## Web Crawler Patterns

The web crawler uses inclusion and exclusion patterns to determine which URLs to crawl and index:

- **inclusionURLCrawlPatterns**: URLs matching these patterns will be crawled
- **exclusionURLCrawlPatterns**: URLs matching these patterns will not be crawled
- **inclusionURLIndexPatterns**: URLs matching these patterns will be indexed
- **exclusionURLIndexPatterns**: URLs matching these patterns will not be indexed
- **inclusionFileIndexPatterns**: Files matching these patterns will be indexed
- **exclusionFileIndexPatterns**: Files matching these patterns will not be indexed

By default, the crawler will crawl and index all URLs that start with any of the seed URLs.

## IAM Permissions

The stack creates several IAM roles with least-privilege permissions:

1. **ApplicationRole**: Allows the Q Business application to write logs and metrics
2. **WebExperienceRole**: Allows the web experience to interact with the Q Business application
3. **WebCrawlerRole**: Allows the web crawler to add and remove documents from the index

## Cleanup

To remove all resources created by this stack:

```bash
cdk destroy
```

## Security Considerations

- The web crawler is configured to crawl public websites by default
- If you need to crawl authenticated websites, you'll need to modify the authentication configuration
- The KMS key used for encryption has a removal policy of DESTROY, which means it will be deleted when the stack is destroyed
- Consider enabling termination protection in production environments

## Troubleshooting

Common issues:

1. **Deployment fails with permission errors**: Ensure your AWS credentials have sufficient permissions to create all required resources
2. **Web crawler isn't indexing content**: Check the seed URLs and inclusion/exclusion patterns
3. **Q Business application isn't available**: Verify that your AWS Identity Center instance is correctly configured

## Testing the Application

After completing the deployment and post-deployment configuration steps, you can test your Amazon Q Business application:

### 1. Access the Web Experience

1. Navigate to the Amazon Q Business console
2. Select your application (`CDK_QBusiness_WebCrawler`)
3. Go to the "Web experiences" tab
4. Click on the web experience URL to open the Q Business web interface
5. Sign in using your AWS Identity Center credentials

### 2. Test Search Functionality

1. Once signed in, use the search bar at the top of the interface
2. Enter keywords related to the content from your crawled websites
3. Review the search results to verify that content was properly indexed
4. Click on search results to view the full content and source information

### 3. Test Conversational AI Features

1. Start a new conversation by clicking on the chat icon
2. Ask questions related to the content from your crawled websites
3. Verify that the AI provides relevant answers with citations to the source content
4. Try follow-up questions to test the contextual understanding

## License

This project is licensed under the MIT License - see the LICENSE file for details.
