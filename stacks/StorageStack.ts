import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "SquirrelFundBucket");
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