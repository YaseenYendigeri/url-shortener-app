import {
  getUrlAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from "#src/controllers/v1/controllers.analytic";
import { Url, Analytic } from "#src/models";
import { fetchCachedAnalytics } from "#src/utils/analytic";
import { successResponse, errorResponse } from "#src/utils/response";

jest.mock("#src/models");
jest.mock("#src/utils/analytic");
jest.mock("#src/utils/response");

describe("Analytics Unit Tests", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getUrlAnalytics - Fetch analytics for a valid alias", async () => {
    const mockReq = { params: { alias: "testAlias" } };
    fetchCachedAnalytics.mockResolvedValue({
      totalClicks: 100,
      uniqueClicks: 50,
      clicksByDate: [],
      osType: [],
      deviceType: [],
    });

    await getUrlAnalytics(mockReq, mockRes);

    expect(fetchCachedAnalytics).toHaveBeenCalledWith(
      expect.anything(),
      "analytics:testAlias",
      expect.any(Function)
    );
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      "Analytics fetched successfully",
      expect.any(Object)
    );
  });

  test("getTopicAnalytics - Fetch analytics for a valid topic", async () => {
    const mockReq = { params: { topic: "testTopic" } };
    fetchCachedAnalytics.mockResolvedValue({
      totalClicks: 200,
      uniqueClicks: 100,
      clicksByDate: [],
      urls: [],
    });

    await getTopicAnalytics(mockReq, mockRes);

    expect(fetchCachedAnalytics).toHaveBeenCalledWith(
      expect.anything(),
      "analytics:testTopic",
      expect.any(Function)
    );
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      "Topic analytics fetched successfully",
      expect.any(Object)
    );
  });

  test("getOverallAnalytics - Fetch overall analytics for a valid user", async () => {
    const mockReq = { user: { id: 1 } };
    fetchCachedAnalytics.mockResolvedValue({
      totalUrls: 5,
      totalClicks: 300,
      uniqueClicks: 150,
      clicksByDate: [],
      deviceType: [],
      osType: [],
    });

    await getOverallAnalytics(mockReq, mockRes);

    expect(fetchCachedAnalytics).toHaveBeenCalledWith(
      expect.anything(),
      "analytics:1",
      expect.any(Function)
    );
    expect(successResponse).toHaveBeenCalledWith(
      mockRes,
      "Overall analytics fetched successfully",
      expect.any(Object)
    );
  });

  test("getUrlAnalytics - Handle non-existent alias", async () => {
    const mockReq = { params: { alias: "invalidAlias" } };
    fetchCachedAnalytics.mockRejectedValue(
      new Error("Short URL not found or expired.")
    );

    await getUrlAnalytics(mockReq, mockRes);

    expect(errorResponse).toHaveBeenCalledWith(
      mockRes,
      "Short URL not found or expired.",
      null,
      404
    );
  });
});
