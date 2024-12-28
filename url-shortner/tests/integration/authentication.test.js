import request from "supertest";
import jwt from "jsonwebtoken";
import appPromise from "../../src/server";
import { db } from "../../src/models/index";
import passport from "../../src/config/passport";
import { JWT_SECRET } from "../../src/config/env";

jest.mock("../../src/config/passport", () => ({
  authenticate: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const { Session } = db;

let app;

beforeAll(async () => {
  app = await appPromise;
});

describe("OAuth2 Authentication", () => {
  describe("GET /auth/google", () => {
    it("should redirect to Google authentication", async () => {
      passport.authenticate.mockImplementationOnce(() => (req, res) => {
        res.redirect("https://accounts.google.com/o/oauth2/auth");
      });

      const res = await request(app).get("/auth/google");

      expect(res.status).toBe(302);
      expect(res.headers.location).toContain(
        "https://accounts.google.com/o/oauth2/auth"
      );
    });
  });

  describe("GET /auth/google/callback", () => {
    it("should authenticate user and return a token", async () => {
      const mockUser = { id: "12345", email: "test@example.com" };
      const mockSession = { id: "mockSessionId", isActive: true };

      passport.authenticate.mockImplementationOnce((_, callback) => {
        return (req, res) => {
          callback(null, mockUser);
        };
      });

      jwt.sign.mockReturnValue("mockToken123");
      Session.create = jest.fn().mockResolvedValue(mockSession);

      const res = await request(app).get("/auth/google/callback");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Authentication successful.");
      expect(res.body.data).toEqual({
        token: "mockToken123",
        session: mockSession,
      });
      expect(Session.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        isActive: true,
      });
    });

    it("should return an error if authentication fails", async () => {
      passport.authenticate.mockImplementationOnce((_, callback) => {
        return (req, res) => {
          callback(new Error("Authentication error"), null);
        };
      });

      const res = await request(app).get("/auth/google/callback");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Authentication failed.");
    });
  });

  describe("POST /auth/logout", () => {
    it("should log out the user and deactivate the session", async () => {
      const mockToken = "mockToken123";
      const decodedToken = { id: "12345" };

      jwt.verify.mockReturnValue(decodedToken);
      Session.update = jest.fn().mockResolvedValue([1]);

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Successfully logged out.");
      expect(Session.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { user_id: decodedToken.id, isActive: true } }
      );
    });

    it("should return an error if no token is provided", async () => {
      const res = await request(app).post("/auth/logout");

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("No token provided. Logout failed.");
    });

    it("should return an error if token verification fails", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });

      const res = await request(app)
        .post("/auth/logout")
        .set("Authorization", `Bearer invalidToken123`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe(
        "An error occurred during the logout process."
      );
    });
  });
});
