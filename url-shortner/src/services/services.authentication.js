import * as sessionService from "#src/services/services.sessions";

import User from "#src/models/models.user";
import { CustomError } from "#src/utils/customError";
import { createToken } from "#src/utils/jwtHelper";
import httpStatus from "http-status-codes";

export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new CustomError(
      "User with this email or username already exists.",
      httpStatus.CONFLICT
    );
  }

  const newUser = new User({
    username,
    email,
    hashed_password: password,
  });

  await newUser.save();

  const session = await sessionService.createSession(newUser._id);
  const token = createToken({ sessionId: session._id, userId: newUser._id });

  return {
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    token,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found.", httpStatus.NOT_FOUND);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomError("Invalid credentials.", httpStatus.UNAUTHORIZED);
  }

  const session = await sessionService.createSession(user._id);
  const token = createToken({ sessionId: session._id, userId: user._id });

  return {
    user: { id: user._id, username: user.username, email: user.email },
    token,
  };
};

export const logoutUser = async (sessionId) => {
  if (!sessionId) {
    throw new CustomError(
      "Invalid session. Unable to logout.",
      httpStatus.UNAUTHORIZED
    );
  }

  const result = await sessionService.invalidateSession(sessionId);

  if (!result) {
    throw new CustomError(
      "Session not found or already invalidated.",
      httpStatus.NOT_FOUND
    );
  }

  return { message: "User logged out successfully." };
};

export const findUser = async (filter) => {
  return await User.findOne(filter);
};
