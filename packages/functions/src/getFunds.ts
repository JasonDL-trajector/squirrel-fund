import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { userId, fundId } = event.queryStringParameters || {};

    if (event.httpMethod === 'GET' && fundId) {
        if (!userId || !fundId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required parameters' }),
            };
        }

        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName: process.env.TABLE_NAME || '', // Ensure TableName is not undefined
            Key: {
                userId: userId,
                fundId: fundId,
            },
        };

        try {
            const result = await dynamoDb.get(params).promise();
            return {
                statusCode: 200,
                body: JSON.stringify(result.Item),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch fund' }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method not allowed' }),
    };
};