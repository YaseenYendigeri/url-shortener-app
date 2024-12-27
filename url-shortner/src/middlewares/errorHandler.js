import { logger } from "#src/utils/logger";
import { errorResponse } from "#src/utils/response";
import StatusCodes from "http-status-codes";

export const errorHandler = (error, request, response, next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "An unexpected error occurred";
  if (
    error.statusCode &&
    error.message &&
    error.statusCode != StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    logger.error("Non-operational error:", error);
  }

  logger.error("Error:", error);
  errorResponse(response, message, error, statusCode);
};
