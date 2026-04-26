const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const { dynamoDb } = require("./shared/dynamodb");
const { buildResponse } = require("./shared/response");
const { TABLES } = require("./config/constants");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { rating, feedback } = body;

    if (!rating || !feedback) {
      return buildResponse(400, {
        message: "rating and feedback are required",
      });
    }

    const feedbackItem = {
      feedbackId: crypto.randomUUID(),
      rating,
      feedback,
      submittedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLES.FEEDBACKS,
      Item: feedbackItem,
    });

    await dynamoDb.send(command);

    return buildResponse(201, {
      message: "Feedback submitted successfully",
      feedback: feedbackItem,
    });
  } catch (error) {
    console.error("Submit Feedback Error:", error);

    return buildResponse(500, {
      message: "Internal server error",
      error: error.message,
    });
  }
};