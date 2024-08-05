import { Table } from 'sst/node/table';
import handler from '@squirrel-fund/core/handler';
import dynamoDb from '@squirrel-fund/core/dynamodb';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}');

  const params = {
    TableName: Table.BalanceTable.tableName,
    Key: {
      balanceId: event.pathParameters?.id,
    },
    UpdateExpression:
      'SET balanceAmount = :balanceAmount, balanceDate = :balanceDate',
    ExpressionAttributeValues: {
      ':balanceAmount': data.balanceAmount || null,
      ':balanceDate': data.balanceDate || null,
    },
    ReturnValues: 'ALL_NEW',
  };
  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});
