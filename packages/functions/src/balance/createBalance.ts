import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler"
import dynamoDb from "@squirrel-fund/core/dynamodb"

export const main = handler (async(event) => {

  let data = {
    balanceAmount: 0,
    balanceDate: new Date().toISOString(),
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  };

  const params = {
    TableName: Table.BalanceTable.tableName,
    Item: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      balanceId: uuid.v1(),
      balanceAmount: data.balanceAmount,
      balanceDate: data.balanceDate,
    },
  };
  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});
