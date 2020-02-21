/* eslint-disable @typescript-eslint/camelcase */
import * as env from "./env";
import * as AWS from "aws-sdk";
import * as toolbox from "aws-toolbox";
import * as Types from "./types";
import GailApiClient from "gmail-api-client";
const dynamo = new AWS.DynamoDB.DocumentClient({ region: env.defaultRegion });

const refreshToken = async (): Promise<boolean> => {
  let failCount = 0;
  const allRecords = await toolbox.dynamo.getAllRecords(dynamo, env.dynamoDbTableName);
  const records = allRecords.filter<Types.DynamoDBRecord>(Types.isDynamoDBRecord);
  console.log(`DynamoDBから${records.length}件のレコードを取得しました。トークンを更新します`);
  for (const record of records) {
    const credential = record.Data;
    const client = new GailApiClient(credential.access_token);
    const newToken = await client
      .refreshAccessToken({
        clientId: credential.client_id,
        clientSecret: credential.client_secret,
        refreshToken: credential.refresh_token
      })
      .catch(reason => {
        console.error(`${record.Account} の更新に失敗しました: ${reason}`);
        failCount++;
      });

    if (typeof newToken === "string") {
      const newRecord = { ...record };
      newRecord.Timestamp = new Date().toISOString();
      newRecord.Data.access_token = newToken;
      await dynamo
        .put({
          TableName: env.dynamoDbTableName,
          Item: newRecord
        })
        .promise();
      console.log(`${record.Account}の更新を行いました`);
    }
  }
  if (failCount > 0) {
    return Promise.reject("1件以上のトークン更新が失敗しています");
  }

  return true;
};

export default refreshToken;
