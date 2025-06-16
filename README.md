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

1. [AWS CLI](https://aws.amazon.com/cli/) installed and configured
2. [Node.js](https://nodejs.org/) (v14.x or later)
3. [AWS CDK](https://aws.amazon.com/cdk/) installed (`npm install -g aws-cdk`)
4. An AWS Identity Center instance ARN
5. A list of seed URLs to crawl
6. AWS credentials configured (`aws configure`) with appropriate permissions to create resources

### Getting Your AWS Identity Center Instance ARN

To find your AWS Identity Center instance ARN:

1. Sign in to the AWS Management Console
2. Navigate to the AWS IAM Identity Center service
3. In the left navigation pane, choose "Settings"
4. Under "Identity source", you'll find your Identity Center ARN in the format:
   `arn:aws:sso:::instance/ssoins-xxxxxxxxxx`
5. Copy this ARN to use in your configuration

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

### Bootstrap Your AWS Environment

Before deploying the CDK stack for the first time in an AWS environment, you need to bootstrap the environment:

```bash
# Bootstrap your AWS environment 
cdk bootstrap 
```

### Deploy the Stack

To deploy the application to your AWS account:

```bash
# Configure your AWS credentials if not already done
aws configure

# Deploy the stack
cdk deploy
```

This will:
1. Compile the TypeScript code
2. Synthesize a CloudFormation template
3. Deploy the stack to your default AWS account and region

You can also run these steps individually:

```bash
# Compile TypeScript to JavaScript
cdk build

# Synthesize CloudFormation template
cdk synth

# Deploy the stack
cdk deploy
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
