import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.DepositTable.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      depositId: event.pathParameters?.id,
    },
    UpdateExpression: "SET name = :name, depositAmount = :depositAmount, depositNote = :depositNote, depositDate = :depositDate",
    ExpressionAttributeValues: {
      ":name": data.name || null,
      ":depositAmount": data.depositAmount || null,
      ":depositNote": data.depositNote || null,
      ":depositDate": data.depositDate || null,
    },
    ReturnValues: "ALL_NEW",
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
