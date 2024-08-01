import { StackContext, Api, use, Config } from 'sst/constructs';
import { StorageStack } from './StorageStack';

export function APIStack({ stack }: StackContext) {
  const { depositTable, withdrawTable, balanceTable, billTable } =
    use(StorageStack);


  const api = new Api(stack, 'api', {
    defaults: {
      authorizer: 'iam',
      function: {
        bind: [
          depositTable,
          withdrawTable,
          balanceTable,
          billTable,
   
        ],
      },
    },
    routes: {
      'GET /deposit': 'packages/functions/src/deposit/listDeposits.main',
      'GET /deposit/{id}': 'packages/functions/src/deposit/getDeposit.main',
      'POST /deposit': 'packages/functions/src/deposit/createDeposit.main',
      'PUT /deposit/{id}': 'packages/functions/src/deposit/updateDeposit.main',
      'DELETE /deposit/{id}':
        'packages/functions/src/deposit/deleteDeposit.main',

      'GET /balance': 'packages/functions/src/balance/listBalances.main',
      'GET /balance/{id}': 'packages/functions/src/balance/getBalance.main',
      'POST /balance': 'packages/functions/src/balance/createBalance.main',
      'PUT /balance/{id}': 'packages/functions/src/balance/updateBalance.main',

      'GET /withdraw': 'packages/functions/src/withdraw/listWithdraws.main',
      'GET /withdraw/{id}': 'packages/functions/src/withdraw/getWithdraw.main',
      'POST /withdraw': 'packages/functions/src/withdraw/createWithdraw.main',
      'PUT /withdraw/{id}':
        'packages/functions/src/withdraw/updateWithdraw.main',
      'DELETE /withdraw/{id}':
        'packages/functions/src/withdraw/deleteWithdraw.main',

      'GET /bill': 'packages/functions/src/bills/listBills.main',
      'GET /bill/{id}': 'packages/functions/src/bills/getBill.main',
      'POST /bill': 'packages/functions/src/bills/createBill.main',
      'PUT /bill/{id}': 'packages/functions/src/bills/updateBill.main',
      'DELETE /bill/{id}': 'packages/functions/src/bills/deleteBill.main',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
