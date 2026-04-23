const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const { dynamoDb } = require("./shared/dynamodb");
const { buildResponse } = require("./shared/response");
const { COMPLAINT_STATUS, TABLES } = require("./config/constants");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const complaintId =
      event.pathParameters?.complaintId || body.complaintId;
    const { status } = body;

    if (!complaintId || !status) {
      return buildResponse(400, {
        message: "complaintId and status are required"
      });
    }

    const allowedStatuses = [
      COMPLAINT_STATUS.SUBMITTED,
      COMPLAINT_STATUS.IN_PROGRESS,
      COMPLAINT_STATUS.RESOLVED
    ];

    if (!allowedStatuses.includes(status)) {
      return buildResponse(400, {
        message: "Invalid status value"
      });
    }

    const command = new UpdateCommand({
      TableName: TABLES.COMPLAINTS,
      Key: {
        complaintId
      },
      UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    });

    const result = await dynamoDb.send(command);

    return buildResponse(200, {
      message: "Complaint status updated successfully",
      complaint: result.Attributes
    });
  } catch (error) {
    console.error("Update Complaint Status Error:", error);

    return buildResponse(500, {
      message: "Internal server error",
      error: error.message
    });
  }
};