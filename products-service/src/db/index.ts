import { DynamoDB } from "aws-sdk";

export const DB_CONFIG = {
  products: "Products",
  stocks: "Stocks",
  region: "eu-north-1",
};

const DB = new DynamoDB.DocumentClient();

export default DB;
