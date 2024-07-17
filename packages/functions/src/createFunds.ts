import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler"
import dynamoDb from "@squirrel-fund/core/dynamodb"

export const main = handler (async(event) => {

  let data = {
    fundAmount: "",
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  };

  const params = {
    TableName: Table.SquirrelFundTable.tableName,
    Item: {
        userId: "1",
        name: "Jason",
        fundId: uuid.v1(),
        fundAmount: data.fundAmount,
        createdAt: Date.now(),
    },
  };
  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});
  