import * as AWS from "aws-sdk";
import * as toolbox from "ssc-aws-toolbox";
import GmailClient from "gmail-api-client";
import * as env from "./env";

const dynamo = new AWS.DynamoDB.DocumentClient({ region: env.defaultRegion });

type DynamoDBRecord = {
  access_token: string;
};

const isDynamoDBRecord = (arg: any): arg is DynamoDBRecord => {
  if (typeof arg !== "object") {
    return false;
  }
  if (typeof arg.access_token !== "string") {
    return false;
  }
  return true;
};

const getClient = async () => {
  const accessToken = await toolbox.dynamo.getSingleRecord(
    dynamo,
    env.DynamoDbTableName,
    env.DynamoDbTableKeyName,
    env.DynamoDbTableKeyValue,
    isDynamoDBRecord
  );
  return new GmailClient(accessToken.access_token);
};

export default getClient;
