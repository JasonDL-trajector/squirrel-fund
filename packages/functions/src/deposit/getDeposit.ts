import { Table } from 'sst/node/table';
import handler from '@squirrel-fund/core/handler';
import dynamoDb from '@squirrel-fund/core/dynamodb';

export const main = handler(async (event) => {
  const params = {
    TableName: Table.DepositTable.tableName,
    Key: {
      depositId: event.pathParameters?.id,
    },
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    throw new Error('Deposit not found');
  }

  return JSON.stringify(result.Item);
});
