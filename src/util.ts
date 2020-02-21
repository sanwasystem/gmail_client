import * as AWS from "aws-sdk";
import * as env from "./env";
AWS.config.update({ region: env.defaultRegion });
const kms = new AWS.KMS();

const decrypt = async (encrypted: string) => {
  const data = await kms.decrypt({ CiphertextBlob: new Buffer(encrypted, "base64") }).promise();
  const plaintext = data.Plaintext;
  if (!plaintext) {
    throw new Error("failed to decrypt environment variable");
  }
  if (Buffer.isBuffer(plaintext)) {
    return plaintext.toString("ascii");
  }
  return plaintext.toString();
};

export { decrypt };
