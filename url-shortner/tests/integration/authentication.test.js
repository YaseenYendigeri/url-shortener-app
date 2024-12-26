import * as authService from "../../src/services/services.authentication";

import request from "supertest";
import appPromise from "../../src/server";
import { CustomError } from "../../src/utils/customError";

jest.mock("../../src/middlewares/authenticate", () => ({
  authenticate: jest.fn((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      req.locals = {
        sessionId: "mockSessionId",
        user: { id: "mockUserId", email: "mock@example.com" },
      };
      return next();
    }
    res.status(401).json({
      success: false,
      message: "Authorization token is required.",
    });
  }),
}));

let app;

beforeAll(async () => {
  app = await appPromise;
});

describe("AuthController", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const mockUser = {
        username: "user1",
        email: "test@example.com",
        password: "password",
      };
      const mockResponse = {
        user: { id: "12345", username: "user1", email: "test@example.com" },
        token: "token",
      };
      authService.registerUser = jest.fn().mockResolvedValue(mockResponse);

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(mockUser);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully.");
      expect(res.body.data).toEqual(mockResponse);
    });

    it("should return error if user already exists", async () => {
      const mockUser = {
        username: "user1",
        email: "test@example.com",
        password: "password",
      };
      authService.registerUser = jest
        .fn()
        .mockRejectedValue(
          new CustomError(
            "User with this email or username already exists.",
            409
          )
        );

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(mockUser);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe(
        "User with this email or username already exists."
      );
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const mockLogin = { email: "test@example.com", password: "password" };
      const mockResponse = {
        user: { id: "12345", username: "user1", email: "test@example.com" },
        token: "token",
      };
      authService.loginUser = jest.fn().mockResolvedValue(mockResponse);

      const res = await request(app).post("/api/v1/auth/login").send(mockLogin);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful.");
      expect(res.body.data).toEqual(mockResponse);
    });

    it("should return error if user is not found", async () => {
      const mockLogin = {
        email: "nonexistent@example.com",
        password: "password",
      };
      authService.loginUser = jest
        .fn()
        .mockRejectedValue(new CustomError("User not found.", 404));

      const res = await request(app).post("/api/v1/auth/login").send(mockLogin);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });
  });

  describe("POST /logout", () => {
    it("should logout the user", async () => {
      const mockToken = "mockToken123";
      const mockResult = { message: "User logged out successfully." };
      authService.logoutUser = jest.fn().mockResolvedValue(mockResult);

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful.");
    });

    it("should return error if Authorization header is not provided", async () => {
      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Authorization token is required.");
    });
  });
});
