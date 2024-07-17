import { Table } from "sst/node/table";
import handler from "@squirrel-fund/core/handler";
import dynamoDb from "@squirrel-fund/core/dynamodb";

export const main = handler(async (event) => {

	const params = {
		TableName: Table.SquirrelFundTable.tableName,
		Key: {
				userId: "1",
				fundId: event.pathParameters?.id,
		},
	};

	const result = await dynamoDb.get(params);

	if(!result.Item) {
		throw new Error('Fund not found');
	}

	return JSON.stringify( result.Item );
});
   