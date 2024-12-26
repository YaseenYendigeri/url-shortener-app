import * as authService from "#src/services/services.authentication";

import { successResponse } from "#src/utils/response";

export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const { user, token } = await authService.registerUser(userData);
    successResponse(res, "User registered successfully.", { user, token }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    successResponse(res, "Login successful.", { user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.locals;
    await authService.logoutUser(sessionId);
    successResponse(res, "Logout successful.");
  } catch (error) {
    next(error);
  }
};
