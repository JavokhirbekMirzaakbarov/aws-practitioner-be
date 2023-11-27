import { APIGatewayProxyHandler } from "aws-lambda";
import { config } from "aws-sdk";
import {
  formatSuccessJSONResponse,
  formatErrorJSONResponse,
} from "@libs/api-gateway";
import * as ProductDAL from "@src/product-dal/product.DAL";

import { AWS_CONFIG } from "src/config";

if (!config.region) {
  config.update({
    region: AWS_CONFIG.region,
  });
}

export const getProductsList: APIGatewayProxyHandler = async (_event) => {
  try {
    const products = await ProductDAL.getProducts();
    return formatSuccessJSONResponse({
      products,
    });
  } catch (error) {
    return formatErrorJSONResponse({
      message: error.message,
    });
  }
};
