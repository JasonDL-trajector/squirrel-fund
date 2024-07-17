import { StackContext, Api, use, Config } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function APIStack({ stack }: StackContext) {

  const { table } = use(StorageStack)
  const STRIPE_SECRET_KEY = new Config.Secret(stack, "STRIPE_SECRET_KEY");

  const api = new Api(stack, "api", {
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table, STRIPE_SECRET_KEY],
      },
    },
    routes: {
      "GET /funds/{id}": "packages/functions/src/getFunds.main",
      "GET /funds": "packages/functions/src/listFunds.main",
      "POST /funds": "packages/functions/src/createFunds.main",
      "PUT /funds/{id}": "packages/functions/src/updateFunds.main",
      "DELETE /funds/{id}": "packages/functions/src/deleteFunds.main",
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
