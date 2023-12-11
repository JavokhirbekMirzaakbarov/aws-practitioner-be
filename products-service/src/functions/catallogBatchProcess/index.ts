import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: "arn:aws:sqs:eu-north-1:613789936538:catalogItemsQueue",
      },
    },
  ],
};
