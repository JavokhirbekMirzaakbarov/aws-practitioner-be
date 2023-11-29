import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";
import {
  formatSuccessJSONResponse,
  formatErrorJSONResponse,
} from "@libs/api-gateway";
import { CONFIG } from "@src/constants/config";

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const s3 = new S3({ region: CONFIG.region });

    const params = {
      Bucket: CONFIG.bucket,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);

    return formatSuccessJSONResponse(
      {
        url,
      },
      201
    );
  } catch (error) {
    return formatErrorJSONResponse(
      { message: error.message },
      error.statusCode ?? 500
    );
  }
};
