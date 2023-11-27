import { v4 as uuid4 } from "uuid";
import DB, { DB_CONFIG } from "@src/db";
import { Product } from "@src/types/product";

export const createProduct = async (product: Omit<Product, "id" | "count">) => {
  try {
    const { title, description, price } = product;
    const id = uuid4();
    await DB.put({
      TableName: DB_CONFIG.products,
      Item: {
        id,
        title,
        description,
        price,
      },
    }).promise();

    return {
      id,
      ...product,
    };

    // await DB.transactWrite({
    //   TransactItems: [
    //     {
    //       Put: {
    //         TableName: DB_CONFIG.products,
    //         Item: {
    //           id,
    //           title,
    //           description,
    //           price,
    //         },
    //         ConditionExpression: "attribute_not_exists(id)",
    //       },
    //     },
    //     {
    //       Put: {
    //         TableName: DB_CONFIG.stocks,
    //         Item: {
    //           product_id: id.count,
    //         },
    //         ConditionExpression: "attribute_not_exists(product_id)",
    //       },
    //     },
    //   ],
    // }).promise();

    // return {
    //   id,
    //   ...product,
    // };
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const { Items: productItems } = await DB.scan({
      TableName: DB_CONFIG.products,
    }).promise();

    const { Items: stockItems } = await DB.scan({
      TableName: DB_CONFIG.stocks,
    }).promise();

    const products = productItems.map((product) => {
      const stock = stockItems.find((stock) => stock.product_id === product.id);
      return {
        ...product,
        count: stock.count,
      };
    });

    return products;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await DB.get({
      TableName: DB_CONFIG.products,
      Key: { id },
    }).promise();

    if (!product.Item) {
      throw new Error("Product Not Found!");
    }

    const stock = await DB.get({
      TableName: DB_CONFIG.stocks,
      Key: { product_id: id },
    }).promise();

    let count = 0;
    if (stock.Item) count = stock.Item.count;

    return { ...product.Item, count };
  } catch (error) {
    console.log("ERROR RESPONSES", error);
    throw error;
  }
};
