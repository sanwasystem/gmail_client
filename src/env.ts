import * as dotenv from "dotenv";
dotenv.config();

// 指定した名前の環境変数を返す。定義されていなければ例外をスローする
const getEnv = (name: string): string => {
  const result = process.env[name];
  if (result === undefined) {
    throw new Error(`environment variable "${name}" not defined`);
  }
  return result;
};

const dynamoDbTableName = getEnv("dynamoDbTableName");
const dynamoDbTableKeyName = getEnv("dynamoDbTableKeyName");
const defaultKeyValue = getEnv("defaultKeyValue");
const defaultRegion = getEnv("defaultRegion");

export { dynamoDbTableName, dynamoDbTableKeyName, defaultKeyValue, defaultRegion };
