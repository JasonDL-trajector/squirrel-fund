import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler"
import dynamoDb from "@squirrel-fund/core/dynamodb"

export const main = handler (async(event) => {

  let data = {
    name: "",
    withdrawAmount: 0,
    withdrawNote: "",
    withdrawDate: new Date().toISOString(),
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  };

  const params = {
    TableName: Table.WithdrawTable.tableName,
    Item: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      name: data.name,
      withdrawId: uuid.v1(),
      withdrawAmount: data.withdrawAmount,
      withdrawNote: data.withdrawNote,
      withdrawDate: data.withdrawDate,
    },
  };
  await dynamoDb.put(params);

  return JSON.stringify( params.Item );
});
