import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {

  const userId = event.requestContext.authorizer?.iam.cognitoIdentity.identityId;
  console.info("Fetching balances for user:", userId);

  const params = {
    TableName: Table.BalanceTable.tableName,
  };
    const result = await dynamoDb.scan(params);

    return JSON.stringify( result.Items );
});
