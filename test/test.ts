require("dotenv").config();
import * as assert from "assert";
import getClient from "../src/getClient";

describe("test", async () => {
  describe("searchMailIds", async () => {
    it("simple mail id search", async () => {
      const client = await getClient();
      const mails = await client.searchMailIds("");
      assert.notEqual(mails.length, 0);
    });

    it("simple mail content search", async () => {
      const client = await getClient();
      const mails = await client.searchMailIds("");
      const mail = await client.getMailById(mails[0].id);
      console.log(`subject: ${mail.subject}, from: ${mail.from}, to: ${mail.to}`);
    });

    it("mail with attached file", async () => {
      const client = await getClient();
      const mails = await client.searchMailIds("has:attachment");
      const mail = await client.getMailById(mails[0].id);
      console.log(`subject: ${mail.subject}, from: ${mail.from}, to: ${mail.to}`);
      assert.notEqual(mail.attachments.length, 0);
      assert.equal(typeof mail.attachments[0].base64, "string");
      assert.equal(typeof mail.attachments[0].filename, "string");
      assert.equal(typeof mail.attachments[0].mimeType, "string");
      assert.equal(typeof mail.attachments[0].size, "number");
      const content = Buffer.from(mail.attachments[0].base64, "base64");
      assert.equal(content.length, mail.attachments[0].size);
    });
  });

  describe("getLabels", async () => {
    it("get all labels", async () => {
      const client = await getClient();
      const labels = await client.getLabels();
      console.log(`${labels.length} labels aquired`);
      for (const label of labels) {
        assert.equal(typeof label.id, "string");
        assert.equal(typeof label.name, "string");
      }
    });
  });

  describe("addLabels", async () => {
    it("add & remove label 'star'", async () => {
      const client = await getClient();
      const star = (await client.getLabels()).filter(x => x.id === "STARRED");
      if (star.length === 0) {
        assert.fail("label 'STARRED' not found");
      }

      const mail = await client.searchMailIds("-label:starred");
      if (mail.length === 0) {
        assert.fail("mail without star not found");
      }

      const targetMailId = mail[0].id;

      const hasStar = async (mailId: string): Promise<boolean> => {
        const mailContent = await client.getMailById(mailId);
        console.log(
          `subject: ${mailContent.subject}, from: ${mailContent.from}, to: ${
            mailContent.to
          }, label: ${mailContent.labelIds.join(", ")}`
        );
        return mailContent.labelIds.indexOf("STARRED") !== -1;
      };

      // 実際にメール検索をしてスターが付いていないことを確認
      assert.equal(await hasStar(targetMailId), false);

      // スターを付ける
      await client.addLabels(targetMailId, "STARRED");

      // もう一度メール検索をしてスターが付いていることを確認
      assert.equal(await hasStar(targetMailId), true);
    });
  });
});
