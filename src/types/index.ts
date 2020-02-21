/* eslint-disable @typescript-eslint/no-explicit-any */
export type DynamoDBRecord = {
  /**
   * この認証はどのアカウントで行われたかを書いておく。実際の処理には使われない
   */
  Account: string;
  /**
   * "Google"固定
   */
  Service: "Google";
  /**
   * トークン等
   */
  Data: {
    access_token: string;
    client_id: string;
    client_secret: string;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
  /**
   * 最終更新日時
   */
  Timestamp?: string;
};

export const isDynamoDBRecord = (arg: any): arg is DynamoDBRecord => {
  if (arg === null || typeof arg !== "object") {
    return false;
  }
  if (typeof arg.Account !== "string") {
    return false;
  }
  if (arg.Service !== "Google") {
    return false;
  }
  if (arg.Data === null || typeof arg.Data !== "object") {
    return false;
  }
  if (typeof arg.Data.access_token !== "string") {
    return false;
  }
  if (typeof arg.Data.client_id !== "string") {
    return false;
  }
  if (typeof arg.Data.client_secret !== "string") {
    return false;
  }
  if (typeof arg.Data.refresh_token !== "string") {
    return false;
  }
  if (typeof arg.Data.scope !== "string") {
    return false;
  }
  if (typeof arg.Data.token_type !== "string") {
    return false;
  }
  return true;
};
