import { S3Event, S3EventRecord } from "aws-lambda";
import { S3, SQS } from "aws-sdk";
import csvParser from "csv-parser";
import { CONFIG } from "@src/constants/config";

const parseCsv = async (event: S3EventRecord) => {
  try {
    const s3 = new S3({ region: CONFIG.region });
    const sqs = new SQS({ region: CONFIG.region });

    const params = {
      Bucket: CONFIG.bucket,
      Key: event.s3.object.key,
    };

    await new Promise((resolve, reject) => {
      s3.getObject(params)
        .createReadStream()
        .pipe(csvParser())
        .on("data", (data) => {
          sqs.sendMessage(
            {
              QueueUrl: process.env.SQS_URL,
              MessageBody: JSON.stringify(data),
            },
            () => {
              const { title } = data;
              console.log("Send message for product", title);
            }
          );
        })
        .on("error", (error) => {
          reject(error.message);
        })
        .on("end", () => {
          resolve("Parsed to csv!");
        });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const moveCsv = async (event: S3EventRecord) => {
  const s3 = new S3({ region: CONFIG.region });

  try {
    await s3
      .copyObject({
        Bucket: event.s3.bucket.name,
        CopySource: event.s3.bucket.name + "/" + event.s3.object.key,
        Key: event.s3.object.key.replace("uploaded", "parsed"),
      })
      .promise();

    console.log("File copied to /parsed");

    await s3
      .deleteObject({
        Bucket: event.s3.bucket.name,
        Key: event.s3.object.key,
      })
      .promise();

    console.log("Old file deleted", event.s3.object.key);
  } catch (error) {
    console.log(error.message);
  }
};

export const importFileParser = async (event: S3Event) => {
  for (const record of event.Records) {
    await parseCsv(record);
    await moveCsv(record);
  }
};
