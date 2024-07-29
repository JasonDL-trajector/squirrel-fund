import * as uuid from 'uuid';
import { Table } from 'sst/node/table';
import handler from '@squirrel-fund/core/handler';
import dynamoDb from '@squirrel-fund/core/dynamodb';

export const main = handler(async (event) => {
  let data = {
    billName: '',
    billAmount: 0,
    billDate: '',
    billPaid: '',
  };

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.BillTable.tableName,
    Item: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      billName: data.billName,
      billId: uuid.v1(),
      billAmount: data.billAmount,
      billDate: data.billDate,
      billPaid: data.billPaid,
    },
  };
  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});
