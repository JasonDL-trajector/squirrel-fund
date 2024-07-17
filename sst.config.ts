import { SSTConfig } from "sst";
import { APIStack } from "./stacks/APIStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { StorageStack } from "./stacks/StorageStack";
import { AuthStack } from "./stacks/AuthStack";

export default {
  config(_input) {
    return {
      name: "squirrel-fund",
      region: "us-east-1",
      cdk: {
        qualifier: "trj2111-sc",
      },
    };
  },
  stacks(app) {
    app.stack(StorageStack);
    app.stack(APIStack);
    app.stack(AuthStack)
    app.stack(FrontendStack);
  }
} satisfies SSTConfig;
