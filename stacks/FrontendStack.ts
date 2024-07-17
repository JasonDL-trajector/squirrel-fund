import { StackContext, NextjsSite, use, Table } from "sst/constructs";
import { APIStack } from "./APIStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }: StackContext) {
    const { api } = use(APIStack);
    const { table } = use(StorageStack);

    const site = new NextjsSite(stack, "FrontendSite", {
        path: "packages/frontend",
        buildCommand: "pnpm run build",
        environment: {
            API_URL: api.url,
            REGION: app.region,
            TABLE_NAME: table.tableName
        } 
    })

    stack.addOutputs({
        FrontendUrl: site.url
    });
};