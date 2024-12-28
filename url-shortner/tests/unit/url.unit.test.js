import {
  shortenUrl,
  redirectShortUrl,
} from "#src/controllers/v1/controllers.url";
import { checkRateLimit } from "#src/middlewares/rateLimit";
import { generateShortUrl } from "#src/utils/utils";
import { db } from "#src/models/index";
import axios from "axios";
import { initializeRedisClient } from "#src/config/redis";

const mockRequest = (data) => ({
  ...data,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn();
  return res;
};

jest.mock("#src/middlewares/rateLimit");
jest.mock("#src/utils/utils");
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
jest.mock("axios");

describe("Unit: URL Controller", () => {
  describe("shortenUrl", () => {
    it("should create a short URL and return success response", async () => {
      checkRateLimit.mockResolvedValue(false);
      generateShortUrl.mockReturnValue("abc123");
      db.Url.create.mockResolvedValue({
        createdAt: new Date(),
      });

      const req = mockRequest({
        body: {
          longUrl: "https://example.com",
          customAlias: "abc123",
          topic: "Test",
        },
        user: { id: 1 },
      });
      const res = mockResponse();

      await shortenUrl(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Short URL created successfully.",
        })
      );
    });
  });

  describe("redirectShortUrl", () => {
    it("should redirect to cached long URL", async () => {
      const redisMock = {
        get: jest.fn().mockResolvedValue("https://example.com"),
        setEx: jest.fn(),
      };
      initializeRedisClient.mockResolvedValue(redisMock);

      const req = mockRequest({ params: { alias: "abc123" } });
      const res = mockResponse({ redirect: jest.fn() });

      await redirectShortUrl(req, res);

      expect(res.redirect).toHaveBeenCalledWith("https://example.com");
    });
  });
});
