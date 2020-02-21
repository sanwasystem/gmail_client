// gmail client
// https://github.com/sanwasystem/gmail_client

import getClient from "./getClient";
import refreshToken from "./refreshToken";

exports.handler = async (event: any) => {
  if (event.action === undefined) {
    // actionが指定されていなかったらトークンを更新する
    return await refreshToken();
  }

  console.log(event);
  if (event.key !== undefined && typeof event.key !== "string") {
    return Promise.reject("'key' must be undefined or string");
  }
  const client = await getClient(event.key);

  switch (event.action) {
    case "search":
      return await client.searchMailIds(event.condition);
    case "searchEx":
      return await client.searchMails(event.condition);
    case "addLabels":
      return await client.addLabels(event.messageId, event.labelIds);
    case "allLabels":
      return await client.getLabels();
    case "message":
      return await client.getMailById(event.messageId, event.test);
    case "rawMessage":
      return await client.getRawMailById(event.messageId);
    default:
      return Promise.reject(
        "'action' must be either undefined, 'search', 'searchEx', 'addLabels', 'allLabels', 'rawMessage' or 'message'"
      );
  }
};
