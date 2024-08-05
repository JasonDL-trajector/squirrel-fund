import { Table } from 'sst/node/table';
import handler from '@squirrel-fund/core/handler';
import dynamoDb from '@squirrel-fund/core/dynamodb';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}');

  const params = {
    TableName: Table.BillTable.tableName,
    Key: {
      billId: event.pathParameters?.id,
    },
    UpdateExpression:
      'SET billName = :billName, billAmount = :billAmount, billDate = :billDate, billPaid = :billPaid',
    ExpressionAttributeValues: {
      ':billName': data.billName || null,
      ':billAmount': data.billAmount || null,
      ':billDate': data.billDate || null,
      ':billPaid': data.billPaid || null,
    },
    ReturnValues: 'ALL_NEW',
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
