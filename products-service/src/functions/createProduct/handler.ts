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
    console.log(
      "ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2)
    );
    console.info("EVENT\n" + JSON.stringify(event, null, 2));
    const { title, description, price, count } = JSON.parse(event.body);
    const { error } = productSchema.validate({
      title,
      description,
      price,
      count,
    });

    if (error) {
      throw new AppError("Product Data is invalid", 400);
    }
    const product = await ProductDAL.createProduct({
      title,
      description,
      price,
      count,
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
