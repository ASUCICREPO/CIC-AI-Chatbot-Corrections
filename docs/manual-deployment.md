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
![image](https://github.com/user-attachments/assets/3f28f9ad-9f69-47d6-999a-5488c2304f1b)


### Step 2: Navigate to Amazon Q Business

1. Click on the search bar at the top of your AWS console
![image](https://github.com/user-attachments/assets/d9331c53-ea49-4b2a-a9d2-cb48a9902265)
2. Type "Amazon Q Business"
3. Click "Amazon Q Business" from the search results
![image](https://github.com/user-attachments/assets/47f9f7ca-e464-4332-a770-53ccd9d402c7)

### Step 3: Create Application

1. Click "Create application"
![image](https://github.com/user-attachments/assets/f2193676-c577-4904-bb3b-3aa04a9bc715)
2. Click "Create"
![image](https://github.com/user-attachments/assets/89fef46e-aa53-439b-8da0-bf20801d0303)

### Step 4: Add Index

1. Click "Data sources"
![image](https://github.com/user-attachments/assets/a14cf859-02cc-4c1b-98a2-c2d163fd81c9)
2. Click "Add an index"
![image](https://github.com/user-attachments/assets/1ab0452f-c664-4b8f-9cf8-0ee331f0f1ec)
3. Click "Starter"
![image](https://github.com/user-attachments/assets/86a4505b-beb7-4562-99cd-61a9479754dd)
4. Click "Add an index"
![image](https://github.com/user-attachments/assets/4a6323df-d3cc-4f1c-889a-14678bca1abd)

### Step 5: Add Data Source

1. Click "Add data source"
![image](https://github.com/user-attachments/assets/9b3c1ff2-376f-4091-b3a0-9b5faf64b720)
2. Click on "Web Crawler"
![image](https://github.com/user-attachments/assets/5016ebf9-4adc-4b21-9aa1-f55bc8c20881)

### Step 6: Configure Web Crawler

1. In the "Data source name" field, type "WebCrawlerDataSource"
![image](https://github.com/user-attachments/assets/e321cd94-02b1-4353-8452-4ea73e34fafb)
2. In the URL field, add your first website URL (e.g., `https://example.com`)
![image](https://github.com/user-attachments/assets/ed512381-d0b0-43b9-bee7-fae7fff68ac1)
3. Add additional seed URLs as needed

**Example seed URLs:**
```
https://example.com
https://example.org
```

### Step 7: Configure IAM Role

1. Under "IAM role", choose "Create a new service role (Recommended)"
![image](https://github.com/user-attachments/assets/c837e6e2-6fb0-45c9-a337-149323a8dee1)
![image](https://github.com/user-attachments/assets/60641153-661c-4ad1-a261-1f916d09f1b8)

### Step 8: Configure Advanced Settings

1. **File Attachments**: Check the box for "Crawl and index files attachments" to include PDF files and other documents that webpages link to
2. **Advanced Indexing**: Under "Multi-media content configuration", check the box for "Visual content in documents" 
![image](https://github.com/user-attachments/assets/36cc15d3-6a17-4d98-b1ae-efff61e74520)

**Note**: Advanced indexing is optional but recommended as it enables extraction and indexing of content from images, PDFs, and other multimedia files. Be aware that enabling this feature may incur additional costs for processing multimedia content.

### Step 9: Configure Sync Schedule

1. Select "Run on demand" to manually sync the data source when needed
![image](https://github.com/user-attachments/assets/d7b24bda-c913-4ffe-9d1e-dba48a41474b)

### Step 10: Configure HTML Settings

1. In the HTML section, select all checkboxes to ensure comprehensive content indexing
![image](https://github.com/user-attachments/assets/23c4ef9c-4348-434a-b726-ecfd40d677f3)

### Step 11: Configure Attachment Settings

1. In the attachment section, select all checkboxes to index various file types
![image](https://github.com/user-attachments/assets/4f0b5ff4-1cbd-4638-9097-500b20ae890d)

### Step 12: Create Data Source

1. Click "Add data source" to create your web crawler data source
![image](https://github.com/user-attachments/assets/59270320-8c48-404b-b467-3f867c95107e)

### Step 13: Initial Sync

1. Click "Sync now" to start the initial crawling process
![image](https://github.com/user-attachments/assets/a787f95c-847a-4d2c-80f6-9c74a5158c99)
2. Monitor the sync status on the same page

**Note**: The initial sync may take some time depending on the volume of content on your websites. Monitor the progress in the console.

### Step 14: Add Users

1. Navigate back to your Amazon Q Business application
![image](https://github.com/user-attachments/assets/09fcfe92-2865-4bdd-b15e-fe2427ca599a)
2. In the "User access" pane, click "Manage user access"
3. Click "Users", click "Add groups and users"
4. Search for and select the users you want to add, and click "Assign"
5. Assign subscription types to each user:
      Pro: Full access to all features, including document upload and custom plugins
      Lite: Basic access with limited features
6. Click "Confirm" to confirm


**Note**: Newly created users will receive a welcome email with instructions to access the application.

### Step 15: Access Your Application

1. Click on the Amazon Q Business application in the left sidebar
2. Go to the "Web experience settings" tab
3. Click on the deployed URL to access your frontend application
![image](https://github.com/user-attachments/assets/f13c9d45-9532-4205-8aae-144aa65aff19)

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
