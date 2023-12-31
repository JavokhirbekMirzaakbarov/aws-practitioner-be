import { APIGatewayProxyHandler } from "aws-lambda";
import { config } from "aws-sdk";
import {
  formatErrorJSONResponse,
  formatSuccessJSONResponse,
} from "@libs/api-gateway";
import * as ProductDAL from "src/product-dal/product.DAL";
import { AWS_CONFIG } from "src/config";

if (!config.region) {
  config.update({
    region: AWS_CONFIG.region,
  });
}

export const getProductById: APIGatewayProxyHandler = async (event) => {
  try {
    console.log(
      "ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2)
    );
    console.info("EVENT\n" + JSON.stringify(event, null, 2));
    const { id } = JSON.parse(JSON.stringify(event.pathParameters));
    const product = await ProductDAL.getProductById(id);
    return formatSuccessJSONResponse({
      product,
    });
  } catch (error) {
    return formatErrorJSONResponse({
      message: error.message,
    });
  }
};
