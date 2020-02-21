import getClient from "../getClient";

const func = async () => {
  const client = await getClient();
  const result = await client.getLabels();
  console.log(JSON.stringify(result, null, 2));
};

func();
