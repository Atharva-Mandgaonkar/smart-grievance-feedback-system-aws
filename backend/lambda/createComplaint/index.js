const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const { dynamoDb } = require("./shared/dynamodb");
const { buildResponse } = require("./shared/response");
const { COMPLAINT_STATUS, TABLES } = require("./config/constants");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const {
      category,
      routeNumber,
      location,
      description,
      image
    } = body;

    if (!category || !routeNumber || !description) {
      return buildResponse(400, {
        message: "category, routeNumber, and description are required"
      });
    }

    const complaintItem = {
      complaintId: crypto.randomUUID(),
      category,
      routeNumber,
      location: location || "",
      description,
      image: image || "",
      status: COMPLAINT_STATUS.SUBMITTED,
      createdAt: new Date().toISOString()
    };

    const command = new PutCommand({
      TableName: TABLES.COMPLAINTS,
      Item: complaintItem
    });

    await dynamoDb.send(command);

    return buildResponse(201, {
      message: "Complaint created successfully",
      complaint: complaintItem
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    return buildResponse(500, {
      message: "Internal server error",
      error: error.message
    });
  }
};