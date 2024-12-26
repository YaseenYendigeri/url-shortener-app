import * as authService from "#src/services/services.authentication";

import { verifyToken } from "#src/utils/jwtHelper";
import { errorResponse } from "#src/utils/response";
import httpStatus from "http-status-codes";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return errorResponse(
        res,
        "Authorization token is required.",
        null,
        httpStatus.UNAUTHORIZED
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(
        res,
        "Invalid authorization token.",
        null,
        httpStatus.UNAUTHORIZED
      );
    }

    const sessionId = decoded.sessionId || null;
    const user = await authService.findUser({ _id: decoded.userId });
    if (!user) {
      return errorResponse(res, "User not found.", null, httpStatus.NOT_FOUND);
    }

    req.locals = { sessionId, user };
    next();
  } catch (error) {
    errorResponse(res, "Unauthorized", error.message, httpStatus.UNAUTHORIZED);
  }
};
