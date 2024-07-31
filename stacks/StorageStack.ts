import { Bucket, StackContext, Table } from 'sst/constructs';

export function StorageStack({ stack, app }: StackContext) {
  const bucket = new Bucket(stack, 'SquirrelFundBucket', {
    name: `${app.stage}-squirrel-fund-bucket`,
    cors: [
      {
        maxAge: '1 day',
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        allowedHeaders: ['*'],
      },
    ],
  });

  const depositTable = new Table(stack, 'DepositTable', {
    fields: {
      userId: 'string',
      name: 'string',
      depositId: 'string',
      depositAmount: 'number',
      depositNote: 'string',
      depositDate: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'depositId' },
  });

  const withdrawTable = new Table(stack, 'WithdrawTable', {
    fields: {
      userId: 'string',
      name: 'string',
      withdrawId: 'string',
      withdrawAmount: 'number',
      withdrawNote: 'string',
      withdrawDate: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'withdrawId' },
  });

  const balanceTable = new Table(stack, 'BalanceTable', {
    fields: {
      userId: 'string',
      balanceId: 'string',
      balanceAmount: 'number',
      balanceDate: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'balanceId' },
  });

  const billTable = new Table(stack, 'BillTable', {
    fields: {
      userId: 'string',
      billId: 'string',
      billName: 'string',
      billAmount: 'number',
      billDate: 'string',
      billPaid: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'billId' },
  });

  return {
    bucket,
    depositTable,
    withdrawTable,
    balanceTable,
    billTable,
  };
}
