import request from "supertest";
import app from "../src/app"; // Your Express app
import { redisClient } from "#src/config/redis";
import { db } from "#src/models/index";
import { Op } from "sequelize";
const { Url, Analytic } = db;

// Mock Redis
jest.mock("#src/config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock Models
jest.mock("#src/models", () => ({
  Url: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Analytic: {
    count: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe("Analytics Integration Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /analytics/url/:alias", () => {
    it("should fetch URL analytics successfully", async () => {
      Url.findOne.mockResolvedValue({
        id: 1,
        custom_alias: "test-alias",
        status: "Active",
      });
      Analytic.count.mockResolvedValueOnce(100); // Total clicks
      Analytic.count.mockResolvedValueOnce(50); // Unique clicks
      Analytic.findAll.mockResolvedValue([]);

      const response = await request(app).get("/analytics/url/test-alias");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalClicks", 100);
      expect(response.body.data).toHaveProperty("uniqueClicks", 50);
      expect(Url.findOne).toHaveBeenCalledWith({
        where: { custom_alias: "test-alias", status: "Active" },
      });
    });

    it("should return 404 for invalid alias", async () => {
      Url.findOne.mockResolvedValue(null);

      const response = await request(app).get("/analytics/url/invalid-alias");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Short URL not found or expired.");
    });
  });

  describe("GET /analytics/topic/:topic", () => {
    it("should fetch topic analytics successfully", async () => {
      Url.findAll.mockResolvedValue([
        { id: 1, custom_alias: "alias1", status: "Active" },
        { id: 2, custom_alias: "alias2", status: "Active" },
      ]);
      Analytic.count.mockResolvedValueOnce(200); // Total clicks
      Analytic.count.mockResolvedValueOnce(150); // Unique clicks
      Analytic.findAll.mockResolvedValue([]);
      Analytic.count.mockImplementation(({ where }) => {
        if (where.url_id === 1) return Promise.resolve(120); // Clicks for alias1
        if (where.url_id === 2) return Promise.resolve(80); // Clicks for alias2
      });

      const response = await request(app).get("/analytics/topic/test-topic");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalClicks", 200);
      expect(response.body.data).toHaveProperty("uniqueClicks", 150);
      expect(response.body.data.urls).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            shortUrl: expect.stringContaining("/alias1"),
            totalClicks: 120,
          }),
          expect.objectContaining({
            shortUrl: expect.stringContaining("/alias2"),
            totalClicks: 80,
          }),
        ])
      );
      expect(Url.findAll).toHaveBeenCalledWith({
        where: { topic: "test-topic", status: "Active" },
      });
    });

    it("should return 404 for topic with no URLs", async () => {
      Url.findAll.mockResolvedValue([]);

      const response = await request(app).get("/analytics/topic/invalid-topic");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "No URLs found for the specified topic."
      );
    });
  });

  describe("GET /analytics/overall", () => {
    it("should fetch overall analytics successfully", async () => {
      const userId = 1;
      Url.findAll.mockResolvedValue([
        { id: 1, custom_alias: "alias1", status: "Active" },
        { id: 2, custom_alias: "alias2", status: "Active" },
      ]);
      Analytic.count.mockResolvedValueOnce(300); // Total clicks
      Analytic.count.mockResolvedValueOnce(200); // Unique clicks
      Analytic.findAll.mockResolvedValue([]);

      const response = await request(app)
        .get("/analytics/overall")
        .set("Authorization", `Bearer fake-token`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("totalUrls", 2);
      expect(response.body.data).toHaveProperty("totalClicks", 300);
      expect(response.body.data).toHaveProperty("uniqueClicks", 200);
      expect(Url.findAll).toHaveBeenCalledWith({
        where: { user_id: userId, status: "Active" },
      });
    });

    it("should return 404 if no URLs are found", async () => {
      Url.findAll.mockResolvedValue([]);

      const response = await request(app).get("/analytics/overall");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("No URLs found for this user.");
    });
  });
});
