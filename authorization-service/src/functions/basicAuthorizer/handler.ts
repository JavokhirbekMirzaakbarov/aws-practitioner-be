import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResultContext,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";
import "dotenv/config";

const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context: APIGatewayAuthorizerResultContext,
  callback: APIGatewayAuthorizerCallback
) => {
  try {
    const { authorizationToken: authorizationHeader, methodArn } = event;
    const encodedCredentials = authorizationHeader.split(" ")[1];
    const [username, password] = Buffer.from(encodedCredentials, "base64")
      .toString()
      .split(":");

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";
    const policy = generatePolicy(encodedCredentials, methodArn, effect);
    console.log(`Policy: ${JSON.stringify(policy)}`);
    callback(null, policy);
  } catch (err) {
    callback("Unauthorized", err.message);
  }
};

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: string
) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
export const authorizer = basicAuthorizer;
