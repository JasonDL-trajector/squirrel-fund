import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "SquirrelFundBucket", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowedHeaders: ["*"],
      },
    ],
  });
  const table = new Table(stack, "SquirrelFundTable", {
    fields: {
      userId: 'string',
      name: 'string',
      fundId: 'string',
      fundAmount: 'string',
      createdAt: 'string',
    },
    primaryIndex: { partitionKey: "userId", sortKey: "fundId" },
  })

  return {
    bucket,
    table
  }
}