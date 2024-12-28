import { StatusCodes } from "http-status-codes";

export const successResponse = (
  response,
  message,
  data,
  statusCode = StatusCodes.OK
) => {
  return response.status(statusCode).json({
    success: true,
    message,
    statusCode,
    data,
  });
};

// Handle error response
export const errorResponse = (
  response,
  message,
  error,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  return response.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
  });
};
