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
  identityCenterInstanceArn: 'arn:aws:sso:::instance/ssoins-example', // <-- Replace with your actual ARN
  seedUrls: [
    'https://example.com',
  ], // <-- Replace with your actual URLs to crawl
});
