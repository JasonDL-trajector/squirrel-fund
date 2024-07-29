import { Table } from 'sst/node/table';
import handler from '@squirrel-fund/core/handler';
import dynamoDb from '@squirrel-fund/core/dynamodb';

export const main = handler(async (event) => {
  const params = {
    TableName: Table.BillTable.tableName,
    Key: {
      userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
      billId: event.pathParameters?.id,
    },
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    throw new Error('Deposit not found');
  }

  return JSON.stringify(result.Item);
});
