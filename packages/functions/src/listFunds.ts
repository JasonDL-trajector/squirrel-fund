import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {

  const params = {
    TableName: Table.SquirrelFundTable.tableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
    },
  };
    const result = await dynamoDb.query(params);

    return JSON.stringify( result.Items );
});
