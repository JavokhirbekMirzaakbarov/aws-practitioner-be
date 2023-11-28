const AWS = require("aws-sdk");
const {
  DynamoDBClient,
  PutCommand,
  TransactWriteCommand,
  TransactWriteItemsCommand,
} = require("@aws-sdk/client-dynamodb");

const products = [
  {
    id: "923f80f8-45fd-456c-a29d-06777680817a",
    title: "Fitness Thingamajig",
    price: 25.99,
    description: "Phasellus eget fringilla justo.",
    count: 3,
  },
  {
    id: "81f27390-f1f0-4a21-a6c6-ec013a7a6130",
    title: "Kids Supplies",
    price: 158.99,
    description: "Quisque nec imperdiet lectus. Aliquam justo dolor",
    count: 5,
  },
  {
    id: "0b0096a8-e37e-4d69-8514-6bcab1320d09",
    title: "Camping Tool",
    price: 163.99,
    description: "In at pharetra ligula, quis convallis nisl.",
    count: 6,
  },
  {
    id: "a1f34fa2-ec4e-4e98-8a9d-61691cef9d9c",
    title: "Engine Thingamajig",
    price: 50,
    description: "Curabitur tristique vehicula vestibulum. ",
    count: 7,
  },
  {
    id: "ed490dda-080f-4d0d-9cda-51957c6e3b67",
    title: "Toy Gadget",
    price: 86,
    description:
      "Pellentesque dictum ante vitae tempor sodales. Phasellus sed egestas felis, id sagittis ipsum. ",
    count: 9,
  },
];

if (!AWS.config.region) {
  AWS.config.update({
    region: "eu-central-1",
  });
}
const DB = new DynamoDBClient();

const productTable = "Products";
const stockTable = "Stocks";

const insertProducts = async () => {
  const promises = products.map((item) => {
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: productTable,
            Item: {
              id: item.id,
              title: item.title,
              description: item.description,
              price: item.price,
            },
          },
        },
        {
          Put: {
            TableName: stockTable,
            Item: {
              product_id: item.id,
              count: item.count,
            },
          },
        },
      ],
    };
    return DB.send(new TransactWriteItemsCommand(params));
  });

  try {
    await Promise.all(promises);
    console.log("Added items to the table successfully.");
  } catch (error) {
    console.error("Error adding items to the table:", error);
  }
};

insertProducts();
