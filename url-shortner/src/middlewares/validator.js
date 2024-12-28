import { errorResponse } from "#src/utils/response";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      errors
        .array()
        .map((error) => error.msg)
        .join(", "),
      null,
      StatusCodes.BAD_REQUEST
    );
  }
  next();
};
