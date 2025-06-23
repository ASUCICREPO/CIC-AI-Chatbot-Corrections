# Manual Deployment Guide

This guide walks you through manually deploying the AWS AI Chatbot for Corrections using the AWS Management Console.

## Prerequisites

Before starting the manual deployment, ensure you have:

1. **AWS Account**: An active AWS account with appropriate permissions
2. **AWS Identity Center**: Set up and configured (see setup instructions below)
3. **Seed URLs**: A list of websites you want to crawl and index

### Setting Up AWS Identity Center

If you haven't already set up AWS Identity Center, follow these steps:

1. Navigate to the [AWS Identity Center setup guide](https://docs.aws.amazon.com/singlesignon/latest/userguide/getting-started.html)
2. Follow the instructions to enable and configure Identity Center
3. Once configured, note your Instance ARN from the Details pane in the Settings page

### Enable Multi-Factor Authentication (Recommended)

For enhanced security, we strongly recommend enabling Multi-Factor Authentication (MFA):

1. Navigate to AWS Identity Center
2. Follow the [official AWS documentation](https://docs.aws.amazon.com/singlesignon/latest/userguide/enable-mfa.html) to enable MFA
3. Configure MFA requirements for your users

This is a security best practice that adds an additional layer of protection to your application.

## Deployment Steps

### Step 1: Access AWS Console

1. Log in to your AWS Management Console
2. Navigate to the region where you want to deploy (e.g., us-west-2)

### Step 2: Navigate to Amazon Q Business

1. Click on the search bar at the top of your AWS console
2. Type "Amazon Q Business"
3. Click "Amazon Q Business" from the search results

### Step 3: Create Application

1. Click "Create application"
2. Click "Create"

### Step 4: Add Index

1. Click "Data sources"
2. Click "Add an index"
3. Click "Starter"
4. Click "Add an index"

### Step 5: Add Data Source

1. Click "Add data source"
2. Click on "Web Crawler"

### Step 6: Configure Web Crawler

1. In the "Data source name" field, type "WebCrawlerDataSource"
2. In the URL field, add your first website URL (e.g., `https://example-corrections-agency.gov/policies/`)
3. Add additional seed URLs as needed

**Example seed URLs:**
```
https://example.com
https://example.org
```

### Step 7: Configure IAM Role

1. Under "IAM role", choose "Create a new service role (Recommended)"

### Step 8: Configure Advanced Settings

1. **File Attachments**: Check the box for "Crawl and index files attachments" to include PDF files and other documents that webpages link to
2. **Advanced Indexing**: Under "Multi-media content configuration", check the box for "Visual content in documents" 

**Note**: Advanced indexing is optional but recommended as it enables extraction and indexing of content from images, PDFs, and other multimedia files. Be aware that enabling this feature may incur additional costs for processing multimedia content.

### Step 9: Configure Sync Schedule

1. Select "Run on demand" to manually sync the data source when needed
2. Alternatively, you can select specific times of day/week based on your preferences

### Step 10: Configure HTML Settings

1. In the HTML section, select all checkboxes to ensure comprehensive content indexing

### Step 11: Configure Attachment Settings

1. In the attachment section, select all checkboxes to index various file types

### Step 12: Create Data Source

1. Click "Add data source" to create your web crawler data source

### Step 13: Initial Sync

1. Click "Sync now" to start the initial crawling process
2. Monitor the sync status on the same page

**Note**: The initial sync may take some time depending on the content volume of your websites. Monitor the progress in the console.

### Step 14: Add Users

1. Navigate back to your Amazon Q Business application
2. In the "User access" pane, click "Manage user access"
3. Click "Add users" or "Add groups"
4. Search for and select the users/groups you want to add
5. Assign subscription types to each user:
   - **Pro**: Full access to all features including document upload and custom plugins
   - **Lite**: Basic access with limited features
6. Click "Add" to confirm

**Note**: Newly created users will receive a welcome email with instructions to access the application.

### Step 15: Access Your Application

1. Click on the Amazon Q Business application in the left sidebar
2. Go to the "Web experiences" tab
3. Click on the deployed URL to access your frontend application

## Important Configuration Notes

### URL Pattern Updates

**Important**: If you later change the Source URLs after deployment, you must also update the following settings:

1. Navigate to your WebCrawlerDataSource
2. Go to "Additional Configuration"
3. Update the "Crawl URL Patterns" to match your new URLs
4. Update the "URL Pattern to Index" to match your new URLs

This ensures that the crawler properly processes your updated URLs.

### Web Crawler Patterns

The web crawler uses inclusion and exclusion patterns to determine which URLs to crawl and index. By default, it will crawl and index all URLs that start with your seed URLs. You can customize these patterns in the "Additional Configuration" section:

- **Inclusion URL Crawl Patterns**: URLs matching these patterns will be crawled
- **Exclusion URL Crawl Patterns**: URLs matching these patterns will not be crawled
- **Inclusion URL Index Patterns**: URLs matching these patterns will be indexed
- **Exclusion URL Index Patterns**: URLs matching these patterns will not be indexed

## Testing Your Application

After completing the deployment steps:

### 1. Access the Web Experience

1. Navigate to the Amazon Q Business console
2. Select your application
3. Go to the "Web experiences" tab
4. Click on the web experience URL
5. Sign in using your AWS Identity Center credentials

### 2. Test Search Functionality

1. Use the search bar to enter keywords related to your crawled content
2. Review search results to verify proper indexing
3. Click on results to view full content and source information

### 3. Test Conversational AI Features

1. Start a new conversation using the chat interface
2. Ask questions related to your crawled content
3. Verify that responses include proper citations to source content
4. Test follow-up questions for contextual understanding

## Cleanup Instructions

To manually remove the resources you created:

### Remove Data Sources
1. Navigate to Amazon Q Business console
2. Select your application
3. Go to "Data sources" tab
4. Select your WebCrawlerDataSource
5. Click "Actions" -> "Delete"
6. Confirm deletion

### Remove Application
1. In the Amazon Q Business console
2. Select your application
3. Click "Actions" -> "Delete"
4. Confirm deletion

### Remove IAM Roles (Optional)
1. Navigate to IAM console
2. Go to "Roles"
3. Search for roles created for your Q Business application
4. Delete the roles if they're no longer needed

**Note**: Be careful when deleting IAM roles to ensure they're not used by other applications.

## Troubleshooting

Common issues and solutions:

1. **Application not accessible**: Verify AWS Identity Center is properly configured and users are added
2. **No search results**: Check that the web crawler sync completed successfully and URLs are accessible
3. **Empty index**: Verify seed URLs are correct and accessible, check crawl patterns match your URLs
4. **Permission errors**: Ensure proper IAM roles are created and have necessary permissions
5. **Sync failures**: Check that websites are publicly accessible and don't block crawlers

## Next Steps

After successful deployment, consider exploring:

### Advanced Configuration
- **Additional Data Sources**: Connect S3 buckets, databases, or other data sources
- **Authentication**: Configure access to private websites or authenticated content
- **Sync Scheduling**: Set up automatic synchronization schedules
- **Content Filtering**: Implement guardrails and content filtering

### Security Enhancements
- **Access Controls**: Fine-tune user permissions and data access
- **Audit Logging**: Enable comprehensive logging for compliance
- **Encryption**: Configure additional encryption options

### Performance Optimization
- **Index Tuning**: Optimize indexing parameters for your content
- **Cost Management**: Monitor and optimize usage costs
- **Query Performance**: Tune search and retrieval performance

For detailed information on advanced features, refer to the [official Amazon Q Business documentation](https://docs.aws.amazon.com/amazonq/latest/business-use-dg/).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
