import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as q from 'aws-cdk-lib/aws-qbusiness';
import {} from 'aws-cdk-lib/aws-qbusiness';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';

interface QBusinessStackProps extends cdk.StackProps {
  identityCenterInstanceArn: string;
  seedUrls: string[];
}

export class AmazonQBusinessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: QBusinessStackProps) {
    super(scope, id, props);

    const encryptionKey = new kms.Key(this, 'QBusinessKey', {
      alias: 'QBusinessKey',
      pendingWindow: cdk.Duration.days(7),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const applicationPolicy = new iam.ManagedPolicy(this, 'ApplicationPolicy', {
      statements: [
        new iam.PolicyStatement({
          sid: 'AmazonQApplicationPutMetricDataPermission',
          actions: ['cloudwatch:PutMetricData'],
          resources: ['*'],
          conditions: {
            StringEquals: { 'cloudwatch:namespace': 'AWS/QBusiness' },
          },
        }),
        new iam.PolicyStatement({
          sid: 'AmazonQApplicationDescribeLogGroupsPermission',
          actions: ['logs:DescribeLogGroups'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          sid: 'AmazonQApplicationCreateLogGroupPermission',
          actions: ['logs:CreateLogGroup'],
          resources: [
            `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/qbusiness/*`,
          ],
        }),
        new iam.PolicyStatement({
          sid: 'AmazonQApplicationLogStreamPermission',
          actions: [
            'logs:DescribeLogStreams',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          resources: [
            `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/qbusiness/*:log-stream:*`,
          ],
        }),
      ],
    });

    const applicationRole = new iam.Role(this, 'ApplicationRole', {
      assumedBy: new iam.ServicePrincipal('qbusiness.amazonaws.com', {
        conditions: {
          StringEquals: { 'aws:SourceAccount': this.account },
          ArnLike: {
            'aws:SourceArn': `arn:aws:qbusiness:${this.region}:${this.account}:application/*`,
          },
        },
      }),
      managedPolicies: [applicationPolicy],
    });

    const application = new q.CfnApplication(this, 'Application', {
      displayName: 'AWS_AI_Chatbot_Corrections',
      identityCenterInstanceArn: props.identityCenterInstanceArn,
      roleArn: applicationRole.roleArn,
    });

    const index = new q.CfnIndex(this, 'Index', {
      type: 'STARTER',
      capacityConfiguration: {
        units: 1,
      },
      applicationId: application.attrApplicationId,
      displayName: 'Index',
    });

    new q.CfnRetriever(this, 'Retriever', {
      type: 'NATIVE_INDEX',
      applicationId: application.attrApplicationId,
      displayName: 'Retriever',
      configuration: {
        nativeIndexConfiguration: {
          indexId: index.attrIndexId,
        },
      },
    });

    const principal = new iam.ServicePrincipal('application.qbusiness.amazonaws.com', {
      conditions: {
        StringEquals: { 'aws:SourceAccount': this.account },
        ArnEquals: { 'aws:SourceArn': application.attrApplicationArn },
      },
    });

    const webExperiencePolicy = new iam.ManagedPolicy(this, 'WebExperiencePolicy', {
      statements: [
        new iam.PolicyStatement({
          sid: 'QBusinessConversationPermission',
          actions: [
            'qbusiness:Chat',
            'qbusiness:ChatSync',
            'qbusiness:ListMessages',
            'qbusiness:ListConversations',
            'qbusiness:DeleteConversation',
            'qbusiness:PutFeedback',
            'qbusiness:GetWebExperience',
            'qbusiness:GetApplication',
            'qbusiness:ListPlugins',
            'qbusiness:GetChatControlsConfiguration',
          ],
          resources: [application.attrApplicationArn],
        }),
        new iam.PolicyStatement({
          sid: 'QBusinessQAppsPermissions',
          actions: [
            'qapps:CreateQApp',
            'qapps:PredictProblemStatementFromConversation',
            'qapps:PredictQAppFromProblemStatement',
            'qapps:CopyQApp',
            'qapps:GetQApp',
            'qapps:ListQApps',
            'qapps:UpdateQApp',
            'qapps:DeleteQApp',
            'qapps:AssociateQAppWithUser',
            'qapps:DisassociateQAppFromUser',
            'qapps:ImportDocumentToQApp',
            'qapps:ImportDocumentToQAppSession',
            'qapps:CreateLibraryItem',
            'qapps:GetLibraryItem',
            'qapps:UpdateLibraryItem',
            'qapps:CreateLibraryItemReview',
            'qapps:ListLibraryItems',
            'qapps:CreateSubscriptionToken',
            'qapps:StartQAppSession',
            'qapps:StopQAppSession',
          ],
          resources: [application.attrApplicationArn],
        }),
      ],
    });

    const webExperienceRole = new iam.Role(this, 'WebExperienceRole', {
      assumedBy: principal,
      managedPolicies: [webExperiencePolicy],
    });

    webExperienceRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ['sts:SetContext'],
        principals: [principal],
      }),
    );

    new q.CfnWebExperience(this, 'WebExperience', {
      applicationId: application.attrApplicationId,
      roleArn: webExperienceRole.roleArn,
    });

    const webCrawlerPolicy = new iam.ManagedPolicy(this, 'WebCrawlerPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ['qbusiness:BatchPutDocument', 'qbusiness:BatchDeleteDocument'],
          resources: [
            application.attrApplicationArn,
            index.attrIndexArn,
            `${index.attrIndexArn}/data-source/*`
          ],
        }),
      ],
    });

    const webCrawlerRole = new iam.Role(this, 'WebCrawlerRole', {
      assumedBy: new iam.ServicePrincipal('qbusiness.amazonaws.com', {
        conditions: {
          ArnEquals: { 'aws:SourceArn': application.attrApplicationArn }
        },
      }),
      managedPolicies: [webCrawlerPolicy],
    });

    new q.CfnDataSource(this, 'WebCrawlerDataSource', {
      applicationId: application.attrApplicationId,
      displayName: 'WebCrawlerDataSource',
      indexId: index.attrIndexId,
      configuration: {
        type: 'WEBCRAWLERV2',
        syncMode: 'FORCED_FULL_CRAWL',
        connectionConfiguration: {
          repositoryEndpointMetadata: {
            authentication: 'NoAuthentication',
            seedUrlConnections: props.seedUrls.map(url => ({ seedUrl: url })),
          },
        },
        repositoryConfigurations: {
          webPage: {
            fieldMappings: [
              {
                indexFieldName: '_category',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'category',
              },
              {
                indexFieldName: '_source_uri',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'sourceUrl',
              },
              {
                indexFieldName: '_document_title',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'title',
              },
              {
                indexFieldName: 'wc_html_size',
                indexFieldType: 'LONG',
                dataSourceFieldName: 'htmlSize',
              },
            ],
          },
          attachment: {
            fieldMappings: [
              {
                indexFieldName: '_category',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'category',
              },
              {
                indexFieldName: '_source_uri',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'sourceUrl',
              },
              {
                indexFieldName: 'wc_file_name',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'fileName',
              },
              {
                indexFieldName: 'wc_file_type',
                indexFieldType: 'STRING',
                dataSourceFieldName: 'fileType',
              },
              {
                indexFieldName: 'wc_file_size',
                indexFieldType: 'LONG',
                dataSourceFieldName: 'fileSize',
              },
            ],
          },
        },
        additionalProperties: {
          rateLimit: '300',
          maxFileSize: '50',
          crawlDepth: '2',
          maxLinksPerUrl: '100',
          crawlSubDomain: true,
          crawlAllDomain: false,
          honorRobots: false,
          crawlAttachments: true,
          inclusionURLCrawlPatterns: props.seedUrls.map(url => `${url}.*`),
          exclusionURLCrawlPatterns: [],
          inclusionURLIndexPatterns: props.seedUrls.map(url => `${url}.*`),
          exclusionURLIndexPatterns: [],
          inclusionFileIndexPatterns: props.seedUrls.map(url => `${url}.*`),
          exclusionFileIndexPatterns: [],
        },
      },
      roleArn: webCrawlerRole.roleArn,
    });
  }
}
