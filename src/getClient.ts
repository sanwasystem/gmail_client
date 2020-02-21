import * as AWS from "aws-sdk";
import * as toolbox from "aws-toolbox";
import GmailClient from "gmail-api-client";
import * as env from "./env";
import * as Types from "./types";

const dynamo = new AWS.DynamoDB.DocumentClient({ region: env.defaultRegion });

const getClient = async (key?: string): Promise<GmailClient> => {
  const accessToken = await toolbox.dynamo.getSingleRecord(
    dynamo,
    env.dynamoDbTableName,
    env.dynamoDbTableKeyName,
    key ?? env.defaultKeyValue,
    Types.isDynamoDBRecord
  );
  return new GmailClient(accessToken.Data.access_token);
};

export default getClient;
