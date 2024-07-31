import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  console.log(data);
  console.log(event.pathParameters?.id);

  const params = {
    TableName: Table.WithdrawTable.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      withdrawId: event.pathParameters?.id,
    },
    UpdateExpression: "SET #name = :name, withdrawAmount = :withdrawAmount, withdrawNote = :withdrawNote, withdrawDate = :withdrawDate",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": data.name || null,
      ":withdrawAmount": data.withdrawAmount || null,
      ":withdrawNote": data.withdrawNote || null,
      ":withdrawDate": data.withdrawDate || null,
    },
    ReturnValues: "ALL_NEW",
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
