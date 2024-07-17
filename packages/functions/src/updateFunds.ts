import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.SquirrelFundTable.tableName,
    Key: {
        userId: "1",
        fundId: event.pathParameters?.id,
    },
    UpdateExpression: "set fundAmount = :fundAmount",
    ExpressionAttributeValues: {
        ":fundAmount": data.fundAmount || null,
    },
    ReturnValues: "ALL_NEW",
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
