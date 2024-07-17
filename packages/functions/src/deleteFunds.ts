import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {

  const params = {
    TableName: Table.SquirrelFundTable.tableName,
    Key: {
        userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
        fundId: event.pathParameters?.id,
    },
  };
  await dynamoDb.delete(params);
  
  return JSON.stringify({ status: true });
});
