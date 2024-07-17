import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/constructs";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId, fundId, amount, description } = JSON.parse(event.body || "{}");

  const params = {
    TableName: 'ejd-squirrel-fund-table',
    Item: {
      userId,
      fundId,
      amount,
      description,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Fund added successfully" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not add fund" }),
    };
  }
};
