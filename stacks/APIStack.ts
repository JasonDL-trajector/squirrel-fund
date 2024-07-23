import { StackContext, Api, use, Config } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function APIStack({ stack }: StackContext) {

  const { depositTable, withdrawTable, balanceTable } = use(StorageStack)
  const STRIPE_SECRET_KEY = new Config.Secret(stack, "STRIPE_SECRET_KEY");

  const api = new Api(stack, "api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [depositTable, withdrawTable, balanceTable, STRIPE_SECRET_KEY],
      },
    },
    routes: {

      "GET /deposit": "packages/functions/src/deposit/listDeposits.main",
      "GET /deposit/{id}": "packages/functions/src/deposit/getDeposit.main",
      "POST /deposit": "packages/functions/src/deposit/createDeposit.main",
      "PUT /deposit/{id}": "packages/functions/src/deposit/updateDeposit.main",
      "DELETE /deposit/{id}": "packages/functions/src/deposit/deleteDeposit.main",

      "GET /balance": "packages/functions/src/balance/listBalances.main",
      "GET /balance/{id}": "packages/functions/src/balance/getBalance.main",
      "POST /balance": "packages/functions/src/balance/createBalance.main",
      "PUT /balance/{id}": "packages/functions/src/balance/updateBalance.main",

      "GET /withdraw": "packages/functions/src/withdraw/listWithdraws.main",
      "GET /withdraw/{id}": "packages/functions/src/withdraw/getWithdraw.main",
      "POST /withdraw": "packages/functions/src/withdraw/createWithdraw.main",
      "PUT /withdraw/{id}": "packages/functions/src/withdraw/updateWithdraw.main",
      "DELETE /withdraw/{id}": "packages/functions/src/withdraw/deleteWithdraw.main",

      "POST /billing": "packages/functions/src/billing.main",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
