import { config } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as ProductDAL from "@src/product-dal/product.DAL";
import AppError from "@src/utils/AppError";
import { AWS_CONFIG } from "src/config";
import { productSchema } from "./product.schema";
import {
  formatSuccessJSONResponse,
  formatErrorJSONResponse,
} from "@libs/api-gateway";

if (!config.region) {
  config.update({
    region: AWS_CONFIG.region,
  });
}

export const createProduct: APIGatewayProxyHandler = async (event) => {
  try {
    const { title, description, price } = JSON.parse(event.body);
    const { error } = productSchema.validate({
      title,
      description,
      price,
    });

    if (error) {
      throw new AppError("Product Data is invalid", 400);
    }
    const product = await ProductDAL.createProduct({
      title,
      description,
      price,
    });

    return formatSuccessJSONResponse({ product }, 201);
  } catch (error) {
    return formatErrorJSONResponse(
      {
        message: error.message,
      },
      error.statusCode
    );
  }
};
