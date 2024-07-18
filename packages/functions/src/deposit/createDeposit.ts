import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler"
import dynamoDb from "@squirrel-fund/core/dynamodb"

export const main = handler (async(event) => {

  let data = {
    name: "",
    depositAmount: 0,
    depositNote: "",
    depositDate: new Date().toISOString(),
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  };

  const params = {
    TableName: Table.DepositTable.tableName,
    Item: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      name: data.name,
      depositId: uuid.v1(),
      depositAmount: data.depositAmount,
      depositNote: data.depositNote,
      depositDate: data.depositDate,
    },
  };
  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});
