# Infrastructure as Code (IaC) Deployment

This guide walks you through deploying the AWS AI Chatbot for Corrections using AWS CDK (Cloud Development Kit).

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

### Setting Up AWS Identity Center

If you haven't already set up AWS Identity Center, follow these steps:

1. Navigate to the [AWS Identity Center setup guide](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html)
2. Follow the instructions to enable and configure Identity Center
3. Once configured, proceed to get your Instance ARN as described below

### Getting Your AWS Identity Center Instance ARN

To find your AWS Identity Center instance ARN:

1. Sign in to the AWS Management Console
2. Navigate to the AWS IAM Identity Center service
3. In the left navigation pane, choose "Settings"
4. At the top of the page in the "Details" pane, you'll find your Identity Center ARN in the format:
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

Example seed URL:
```bash
https://example.com
https://example.org
```

**Important Note**: If you later change the Source URLs after deployment, you must also update the `Crawl URL Patterns` and the `URL Pattern to Index` under `WebCrawlerDataSource -> Additional Configuration` in the AWS Console.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ASUCICREPO/AWS-AI-Chatbot-Corrections
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   **Note**: You may see some npm warnings including "1 low severity vulnerability" during installation. These are common npm dependency warnings and do not pose a security risk to your AWS deployment or data. The warnings are related to development dependencies and do not affect the runtime security of your application.

   **CDK Version Compatibility**: If you encounter CDK version compatibility errors during deployment or cleanup, you may need to update your CDK CLI:
   ```bash
   npm uninstall -g aws-cdk
   npm install -g aws-cdk@latest
   ```

## Deployment

### Using the Deployment Script (Recommended)

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

**Expected Deployment Time**: The deployment typically takes 8-12 minutes to complete.

**Security Note**: During deployment, CDK may display a message about security-related changes. This is a standard CDK notification and is expected for this deployment. The changes are necessary for creating the required IAM roles and policies for Amazon Q Business to function properly.

## Post-Deployment Configuration (AWS Console)

After deploying the stack, you need to perform these additional steps in the AWS Console:

### 1. Add Users to the Q Business Application

1. Navigate to the Amazon Q Business console
2. Select your application (`AWS_AI_Chatbot_Corrections`)
3. In the "User access" pane, click "Manage user access"
4. Click "Add users" or "Add groups"
5. Search for and select the users/groups you want to add
6. Assign subscription types to each user:
   - **Pro**: Full access to all features including document upload and custom plugins
   - **Lite**: Basic access with limited features
7. Click "Add" to confirm

**Note**: Newly created users will receive a welcome email with instructions to access the application.

### 2. Enable Multi-Factor Authentication (Recommended)

For enhanced security, we strongly recommend enabling Multi-Factor Authentication (MFA) in AWS Identity Center:

1. Navigate to AWS Identity Center
2. Follow the [official AWS documentation](https://docs.aws.amazon.com/singlesignon/latest/userguide/enable-mfa.html) to enable MFA
3. Configure MFA requirements for your users

This is a security best practice that adds an additional layer of protection to your application.

### 3. Configure Advanced Indexing for Web Crawler

1. Navigate to the Amazon Q Business console
2. Select your application (`AWS_AI_Chatbot_Corrections`)
3. Go to the "Data sources" tab
4. Select the "WebCrawlerDataSource" data source
5. Click "Actions" -> "Edit"
6. Under "Multi-media content configuration", enable "Advanced indexing"
7. Save your changes

**Note**: Advanced indexing is optional but recommended as it enables the crawler to extract and index content from images, PDFs, and other multimedia files. Be aware that enabling this feature may incur additional costs for processing multimedia content.

### 4. Sync the Web Crawler

The web crawler is configured for on-demand synchronization. To start the initial crawl:

1. Navigate to the Amazon Q Business console
2. Select your application (`AWS_AI_Chatbot_Corrections`)
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

If you encounter a CDK version compatibility error, the CDK CLI should already be updated from the installation steps above. If issues persist, verify your CDK version matches your project dependencies.

## Security Considerations

- The web crawler is configured to crawl public websites by default
- If you need to crawl authenticated websites, you'll need to modify the authentication configuration
- The KMS key used for encryption has a removal policy of DESTROY, which means it will be deleted when the stack is destroyed
- Consider enabling termination protection in production environments
- Multi-Factor Authentication is strongly recommended for all users

## Troubleshooting

Common issues:

1. **Deployment fails with permission errors**: Ensure your AWS credentials have sufficient permissions to create all required resources
2. **Web crawler isn't indexing content**: Check the seed URLs and inclusion/exclusion patterns. Verify that the URLs are accessible and that the crawl patterns match your seed URLs.
3. **Q Business application isn't available**: Verify that your AWS Identity Center instance is correctly configured
4. **Empty index after crawling**: Ensure your seed URLs are valid and accessible. Check that the `Crawl URL Patterns` and `URL Pattern to Index` settings match your intended URLs.

## Testing the Application

After completing the deployment and post-deployment configuration steps, you can test your Amazon Q Business application:

### 1. Access the Web Experience

1. Navigate to the Amazon Q Business console
2. Select your application (`AWS_AI_Chatbot_Corrections`)
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

## Next Steps

After successfully deploying and testing your application, consider exploring these advanced features:

### Advanced Data Sources
- **Additional URLs**: Add more seed URLs to expand your knowledge base
- **S3 Integration**: Connect S3 buckets containing documents
- **Database Connectors**: Integrate with databases and other structured data sources
- **Authentication**: Configure authentication for private websites and data sources

### Sync Configuration
- **Scheduled Sync**: Set up automatic synchronization on a schedule
- **Real-time Updates**: Configure webhooks for real-time content updates
- **Incremental Sync**: Optimize sync performance with incremental updates

### Security and Governance
- **Guardrails**: Implement content filtering and safety guardrails
- **Access Controls**: Fine-tune user permissions and data access
- **Audit Logging**: Enable comprehensive audit logging for compliance
- **Data Encryption**: Configure additional encryption options

### Performance Optimization
- **Index Optimization**: Tune indexing parameters for your content type
- **Query Performance**: Optimize search and retrieval performance
- **Cost Management**: Monitor and optimize costs for your usage patterns

For detailed information on these advanced features, refer to the [official Amazon Q Business documentation](https://docs.aws.amazon.com/amazonq/latest/business-use-dg/).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
