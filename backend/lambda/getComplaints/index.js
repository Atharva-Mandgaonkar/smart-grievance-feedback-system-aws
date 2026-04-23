const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const { dynamoDb } = require("./shared/dynamodb");
const { buildResponse } = require("./shared/response");
const { TABLES } = require("./config/constants");

exports.handler = async () => {
  try {
    const command = new ScanCommand({
      TableName: TABLES.COMPLAINTS
    });

    const result = await dynamoDb.send(command);

    return buildResponse(200, {
      message: "Complaints fetched successfully",
      complaints: result.Items || []
    });
  } catch (error) {
    console.error("Get Complaints Error:", error);

    return buildResponse(500, {
      message: "Internal server error",
      error: error.message
    });
  }
};