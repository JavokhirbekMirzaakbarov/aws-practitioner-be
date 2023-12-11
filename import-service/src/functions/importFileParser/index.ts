import { handlerPath } from "@src/libs/handler-resolver";
import { CONFIG } from "@src/constants/config";

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: CONFIG.bucket,
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploaded/",
          },
        ],
        existing: true,
      },
    },
  ],
};
