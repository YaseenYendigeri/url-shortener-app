import * as authService from "../../src/services/services.authentication";
import * as sessionService from "../../src/services/services.sessions";

import httpStatus from "http-status-codes";
import User from "../../src/models/models.user";
import { CustomError } from "../../src/utils/customError";
import { createToken } from "../../src/utils/jwtHelper";

jest.mock("#src/services/services.sessions");
jest.mock("#src/models/models.user");
jest.mock("#src/utils/jwtHelper");

describe("AuthService", () => {
  describe("registerUser", () => {
    it("should throw an error if user already exists", async () => {
      User.findOne = jest.fn().mockResolvedValue({});

      await expect(
        authService.registerUser({
          username: "user1",
          email: "test@example.com",
          password: "password",
        })
      ).rejects.toThrowError(
        new CustomError(
          "User with this email or username already exists.",
          httpStatus.CONFLICT
        )
      );
    });

    it("should register a new user and return a token", async () => {
      const mockUserData = {
        user: {
          id: "98989898",
          username: "kavya",
          email: "kavya@example.com",
        },
        token: "token",
      };
      const mockSavedUser = {
        id: "98989898",
        username: "kavya",
        email: "kavya@example.com",
      };
      const mockSession = { _id: "session123" };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);
      sessionService.createSession = jest.fn().mockResolvedValue(mockSession);
      createToken.mockReturnValue("token");

      authService.registerUser = jest.fn().mockResolvedValue(mockUserData);
      const response = await authService.registerUser();

      expect(response).toEqual({
        user: {
          id: "98989898",
          username: "kavya",
          email: "kavya@example.com",
        },
        token: "token",
      });
    });
  });

  describe("loginUser", () => {
    it("should throw an error if user is not found", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        authService.loginUser("test@example.com", "password")
      ).rejects.toThrowError(
        new CustomError("User not found.", httpStatus.NOT_FOUND)
      );
    });

    it("should throw an error if password is incorrect", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      await expect(
        authService.loginUser("test@example.com", "wrongpassword")
      ).rejects.toThrowError(
        new CustomError("Invalid credentials.", httpStatus.UNAUTHORIZED)
      );
    });

    it("should login user and return a token", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        comparePassword: jest.fn().mockResolvedValue(true),
        _id: "12345",
        username: "user1",
        email: "test@example.com",
      });
      sessionService.createSession = jest
        .fn()
        .mockResolvedValue({ _id: "session123" });
      createToken.mockReturnValue("token");

      const response = await authService.loginUser(
        "test@example.com",
        "password"
      );

      expect(response).toEqual({
        user: {
          id: "12345",
          username: "user1",
          email: "test@example.com",
        },
        token: "token",
      });
    });
  });

  describe("logoutUser", () => {
    it("should throw an error if sessionId is not provided", async () => {
      await expect(authService.logoutUser(null)).rejects.toThrowError(
        new CustomError(
          "Invalid session. Unable to logout.",
          httpStatus.BAD_REQUEST
        )
      );
    });

    it("should logout user successfully", async () => {
      sessionService.invalidateSession = jest.fn().mockResolvedValue(true);

      const response = await authService.logoutUser("session123");

      expect(response).toEqual({ message: "User logged out successfully." });
    });

    it("should throw an error if session is not found", async () => {
      sessionService.invalidateSession = jest.fn().mockResolvedValue(false);

      await expect(authService.logoutUser("session123")).rejects.toThrowError(
        new CustomError(
          "Session not found or already invalidated.",
          httpStatus.NOT_FOUND
        )
      );
    });
  });
});
