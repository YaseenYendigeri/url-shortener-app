import { app } from "#src/server";
import request from "supertest";
import { db } from "#src/models/index";
import { initializeRedisClient } from "#src/config/redis";

jest.mock("#src/models/index", () => ({
  db: {
    Url: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
    Analytic: {
      create: jest.fn(),
    },
  },
}));
jest.mock("#src/config/redis");

describe("Integration: URL Controller", () => {
  let redisMock;

  beforeAll(() => {
    redisMock = {
      get: jest.fn(),
      setEx: jest.fn(),
    };
    initializeRedisClient.mockResolvedValue(redisMock);
    process.env.BASE_URL = "http://localhost:3000";
  });

  describe("POST /api/url/shorten", () => {
    it("should create a short URL and return 201", async () => {
      db.Url.create.mockResolvedValue({
        id: 1,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post("/api/url/shorten")
        .send({
          longUrl: "https://example.com",
          customAlias: "alias123",
          topic: "Test",
        })
        .set("Authorization", "Bearer fakeToken");

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        message: "Short URL created successfully.",
      });
      expect(db.Url.create).toHaveBeenCalled();
    });
  });

  describe("GET /:alias", () => {
    it("should redirect to the long URL if found in Redis", async () => {
      redisMock.get.mockResolvedValue("https://example.com");

      const response = await request(app).get("/alias123");

      expect(response.status).toBe(302);
      expect(response.header.location).toBe("https://example.com");
    });

    it("should return 404 if the alias is not found", async () => {
      redisMock.get.mockResolvedValue(null);
      db.Url.findOne.mockResolvedValue(null);

      const response = await request(app).get("/nonexistent");

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Short URL not found or expired.",
      });
    });
  });
});
