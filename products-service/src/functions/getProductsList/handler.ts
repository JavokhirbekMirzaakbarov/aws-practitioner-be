import { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";

import products from "../../mocks/products";

export const getProductsList: APIGatewayProxyHandler = async () => {
  return formatJSONResponse({
    products,
  });
};
