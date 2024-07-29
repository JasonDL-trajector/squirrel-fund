import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {

  const params = {
    TableName: Table.BillTable.tableName,
  };
    const result = await dynamoDb.scan(params);

    return JSON.stringify( result.Items );
});
