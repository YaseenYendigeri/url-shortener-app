import {
  googleLogin,
  googleCallback,
  logout,
} from "#src/controllers/v1/controllers.authentication";
import passport from "#src/config/passport";
import jwt from "jsonwebtoken";
import { db } from "#src/models/index";
import { StatusCodes } from "http-status-codes";

jest.mock("../../src/config/passport", () => ({
  authenticate: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const { Session } = db;

describe("Auth Controller - Unit Tests", () => {
  describe("googleLogin", () => {
    it("should call passport authenticate with correct parameters", () => {
      const mockAuthenticate = jest.fn();
      passport.authenticate.mockReturnValue(mockAuthenticate);

      const req = {};
      const res = {};
      const next = jest.fn();

      googleLogin(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith("google", {
        scope: ["profile", "email"],
      });
      expect(mockAuthenticate).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("googleCallback", () => {
    let req, res, next, mockAuthenticate;

    beforeEach(() => {
      req = {};
      res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      mockAuthenticate = jest.fn();
      passport.authenticate.mockReturnValue(mockAuthenticate);
    });

    it("should return an error if authentication fails", async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) =>
        next(new Error("Authentication error"))
      );

      await googleCallback(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication failed.",
        data: null,
      });
    });

    it("should return an error if user is not found", async () => {
      mockAuthenticate.mockImplementationOnce((req, res, next) =>
        next(null, null, { message: "User not found" })
      );

      await googleCallback(req, res, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication failed.",
        data: null,
      });
    });

    it("should return a success response with token and session", async () => {
      const mockUser = { id: "12345" };
      const mockSession = { id: "mockSessionId" };

      mockAuthenticate.mockImplementationOnce((req, res, next) =>
        next(null, mockUser)
      );
      jwt.sign.mockReturnValue("mockToken123");
      Session.create = jest.fn().mockResolvedValue(mockSession);

      await googleCallback(req, res, next);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id },
        expect.any(String),
        {
          expiresIn: "1d",
        }
      );
      expect(res.cookie).toHaveBeenCalledWith("auth_token", "mockToken123", {
        httpOnly: true,
        secure: expect.any(Boolean),
      });
      expect(Session.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        isActive: true,
      });
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Authentication successful.",
        data: { token: "mockToken123", session: mockSession },
      });
    });

    it("should return an error if session creation fails", async () => {
      const mockUser = { id: "12345" };

      mockAuthenticate.mockImplementationOnce((req, res, next) =>
        next(null, mockUser)
      );
      jwt.sign.mockReturnValue("mockToken123");
      Session.create = jest.fn().mockRejectedValue(new Error("DB Error"));

      await googleCallback(req, res, next);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Authentication error.",
        data: null,
      });
    });
  });

  describe("logout", () => {
    let req, res;

    beforeEach(() => {
      req = {
        cookies: { auth_token: "mockToken123" },
        headers: {},
      };
      res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should log out successfully and deactivate session", async () => {
      jwt.verify.mockReturnValue({ id: "12345" });
      Session.update = jest.fn().mockResolvedValue([1]);

      await logout(req, res);

      expect(jwt.verify).toHaveBeenCalledWith(
        "mockToken123",
        expect.any(String)
      );
      expect(Session.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { user_id: "12345", isActive: true } }
      );
      expect(res.clearCookie).toHaveBeenCalledWith("auth_token");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Successfully logged out.",
        data: null,
      });
    });

    it("should return an error if no token is provided", async () => {
      req.cookies = {};
      req.headers.authorization = undefined;

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "No token provided. Logout failed.",
        data: null,
      });
    });

    it("should return an error if token verification fails", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred during the logout process.",
        data: null,
      });
    });
  });
});
