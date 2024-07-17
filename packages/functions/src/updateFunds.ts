import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.SquirrelFundTable.tableName,
    Key: {
        userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
        fundId: event.pathParameters?.id,
    },
    UpdateExpression: "SET name = :name, fundAmount = :fundAmount ",
    ExpressionAttributeValues: {
        ":name": data.name || null,
        ":fundAmount": data.fundAmount || null,
    },
    ReturnValues: "ALL_NEW",
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
