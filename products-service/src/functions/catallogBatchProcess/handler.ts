import { SQSHandler, SQSEvent } from "aws-lambda";
import { SNS } from "aws-sdk";
import * as ProductDAL from "@src/product-dal/product.DAL";
import { AWS_CONFIG } from "@src/config";

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log("Getting SQS Message from queue");
  const sns = new SNS({ region: AWS_CONFIG.region });
  try {
    for (const record of event.Records) {
      const { body } = record;
      const { title, price, count, description } = JSON.parse(body);
      await ProductDAL.createProduct({ count, description, price, title });
      await sns
        .publish({
          Subject: "Product Created Successfully",
          Message: `Product ${title} were added to database`,
          TopicArn: process.env.SNS_ARN,
          MessageAttributes: {
            title: {
              DataType: "String",
              StringValue: title,
            },
          },
        })
        .promise();
    }
  } catch (error) {
    console.error(
      "Error during consuming SQS message(addProduct): ",
      error.message
    );
  }
};
