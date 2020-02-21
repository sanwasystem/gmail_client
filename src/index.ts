// gmail client
// https://github.com/sanwasystem/gmail_client

require("dotenv").config();

import getClient from "./getClient";

exports.handler = async (event: any) => {
  console.log(event);
  const client = await getClient();

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
        new Error("action must be either 'search', 'searchEx', 'addLabels', 'allLabels', 'rawMessage' or 'message'")
      );
  }
};
