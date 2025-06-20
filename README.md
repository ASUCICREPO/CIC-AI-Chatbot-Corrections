# AWS AI Chatbot for Corrections - Amazon Q Business with Web Crawler

This project deploys an Amazon Q Business application with a web crawler data source. The solution enables you to create an enterprise search and generative AI assistant that can crawl, index, and retrieve information from specified websites.

Amazon Q Business is the most capable generative AI-powered assistant for finding information, gaining insight, and taking action at work. It makes generative AI securely accessible to everyone in your organization and helps your employees get work done faster.

## Deployment Options

You can deploy this solution using one of two methods:

- **[Infrastructure as Code (IaC) Deployment](docs/iac-deployment.md)** - Automated deployment using AWS CDK (Recommended)
- **[Manual Deployment](docs/manual-deployment.md)** - Step-by-step manual setup through AWS Console

## Architecture Overview

This solution deploys the following AWS resources:

- **Amazon Q Business Application**: The core Q Business application that provides the generative AI capabilities
- **Amazon Q Business Index**: A starter index to store and search document content
- **Amazon Q Business Retriever**: A native index retriever to search indexed content
- **Amazon Q Business Web Experience**: A web interface for users to interact with the Q Business application
- **Amazon Q Business Web Crawler Data Source**: A web crawler that indexes content from specified seed URLs
- **IAM Roles and Policies**: Necessary permissions for the Q Business services to operate
- **KMS Key**: For encryption of sensitive data

## Quick Start

Choose your preferred deployment method:

### Infrastructure as Code (Recommended)
For automated deployment using AWS CDK:
```bash
git clone https://github.com/ASUCICREPO/AWS-AI-Chatbot-Corrections
cd AWS-AI-Chatbot-Corrections
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment
For step-by-step setup through AWS Console, follow the [Manual Deployment Guide](docs/manual-deployment.md).

## What You'll Need

- AWS Account with appropriate permissions
- AWS Identity Center set up and configured
- List of websites you want to crawl and index

## Documentation

- **[IaC Deployment Guide](docs/iac-deployment.md)** - Complete guide for automated deployment
- **[Manual Deployment Guide](docs/manual-deployment.md)** - Step-by-step manual setup instructions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
