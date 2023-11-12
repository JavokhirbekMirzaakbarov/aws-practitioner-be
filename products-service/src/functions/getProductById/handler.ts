import { APIGatewayProxyHandler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";

import products from "../../mocks/products";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const product = products.find((p) => p.id === Number(id));

  return formatJSONResponse({
    product,
  });
};
