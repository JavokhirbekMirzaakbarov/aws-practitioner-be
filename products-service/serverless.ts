import type { AWS } from "@serverless/typescript";

import getProductById from "@functions/getProductById";
import getProductsList from "@functions/getProductsList";
import createProduct from "@functions/createProduct";
import catallogBatchProcess from "@functions/catallogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "products-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-north-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SRS_ARN: {
        Ref: "createProductTopic",
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["sns:*"],
            Resource: [{ Ref: "createProductTopic" }],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catallogBatchProcess,
  },
  package: { individually: false },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "PRODUCT_CREATED",
        },
      },
      emailSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "haluk_furkan_kicik@epam.com",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
        },
      },
      filteredSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "haluk_furkan_kicik@epam.com",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            title: ["ProductOne", "ProductTitle"],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
