import { StackContext, NextjsSite, use } from "sst/constructs";
import { APIStack } from "./APIStack";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";

export function FrontendStack({ stack, app }: StackContext) {
  const { api } = use(APIStack);
  const { auth } = use(AuthStack);
  const { bucket } = use(StorageStack);

  const site = new NextjsSite(stack, "NextJSSite", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    environment: {
      API_URL: api.url,
      REGION: app.region,
      BUCKET: bucket.bucketName,
      USER_POOL_ID: auth.userPoolId,
      USER_POOL_CLIENT_ID: auth.userPoolClientId,
      IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",      
    } 
  })

  stack.addOutputs({
    SiteUrl: site.url
  });
};