import { Op } from "sequelize";
import { db } from "#src/models/index";
import { StatusCodes } from "http-status-codes";
import { successResponse, errorResponse } from "#src/utils/response";
import {
  detectDeviceType,
  detectOS,
  extractDeviceType,
  extractOSName,
} from "#src/utils/utils";
import {
  getRecentDates,
  fetchCachedAnalytics,
  getClicksByDate,
  mapUserAgentData,
} from "#src/utils/analytic";
import { initializeRedisClient } from "#src/config/redis";

const { Url, Analytic, sequelize } = db;
const redisClient = await initializeRedisClient();

export const getUrlAnalytics = async (req, res) => {
  const { alias } = req.params;

  try {
    const analyticsData = await fetchCachedAnalytics(
      redisClient,
      `analytics:${alias}`,
      async () => {
        const url = await Url.findOne({
          where: { custom_alias: alias, status: "Active" },
        });

        if (!url) throw new Error("Short URL not found or expired.");

        const urlId = url.id;

        const [totalClicks, uniqueClicks, clicksByDate, osData, deviceData] =
          await Promise.all([
            Analytic.count({ where: { url_id: urlId } }),
            Analytic.count({
              where: { url_id: urlId },
              distinct: true,
              col: "ip_address",
            }),
            getClicksByDate([urlId]),
            Analytic.findAll({
              attributes: [
                "user_agent",
                [sequelize.fn("COUNT", sequelize.col("id")), "uniqueClicks"],
                [
                  sequelize.fn("COUNT", sequelize.col("ip_address")),
                  "uniqueUsers",
                ],
              ],
              where: { url_id: urlId },
              group: ["user_agent"],
            }),
            Analytic.findAll({
              attributes: [
                "user_agent",
                [sequelize.fn("COUNT", sequelize.col("id")), "uniqueClicks"],
                [
                  sequelize.fn("COUNT", sequelize.col("ip_address")),
                  "uniqueUsers",
                ],
              ],
              where: { url_id: urlId },
              group: ["user_agent"],
            }),
          ]);

        return {
          totalClicks,
          uniqueClicks,
          clicksByDate,
          osType: mapUserAgentData(osData, extractOSName),
          deviceType: mapUserAgentData(deviceData, extractDeviceType),
        };
      }
    );

    return successResponse(
      res,
      "Analytics fetched successfully",
      analyticsData
    );
  } catch (error) {
    console.error("Error in getUrlAnalytics:", error);
    return errorResponse(
      res,
      "Short URL not found or expired.",
      null,
      StatusCodes.NOT_FOUND
    );
  }
};

export const getTopicAnalytics = async (req, res) => {
  const { topic } = req.params;

  try {
    const analyticsData = await fetchCachedAnalytics(
      redisClient,
      `analytics:${topic}`,
      async () => {
        const urls = await Url.findAll({ where: { topic, status: "Active" } });

        if (urls.length === 0)
          throw new Error("No URLs found for the specified topic.");

        const urlIds = urls.map((url) => url.id);

        const [totalClicks, uniqueClicks, clicksByDate, urlAnalytics] =
          await Promise.all([
            Analytic.count({ where: { url_id: { [Op.in]: urlIds } } }),
            Analytic.count({
              where: { url_id: { [Op.in]: urlIds } },
              distinct: true,
              col: "ip_address",
            }),
            getClicksByDate(urlIds),
            Promise.all(
              urls.map(async (url) => ({
                shortUrl: `${req.protocol}://${req.get("host")}/${
                  url.custom_alias
                }`,
                totalClicks: await Analytic.count({
                  where: { url_id: url.id },
                }),
                uniqueClicks: await Analytic.count({
                  where: { url_id: url.id },
                  distinct: true,
                  col: "ip_address",
                }),
              }))
            ),
          ]);

        return { totalClicks, uniqueClicks, clicksByDate, urls: urlAnalytics };
      }
    );

    return successResponse(
      res,
      "Topic analytics fetched successfully",
      analyticsData
    );
  } catch (error) {
    console.error("Error in getTopicAnalytics:", error);
    return errorResponse(
      res,
      "No URLs found for the specified topic.",
      null,
      StatusCodes.NOT_FOUND
    );
  }
};

export const getOverallAnalytics = async (req, res) => {
  const userId = req.user.id;

  try {
    const analyticsData = await fetchCachedAnalytics(
      redisClient,
      `analytics:${userId}`,
      async () => {
        const urls = await Url.findAll({
          where: { user_id: userId, status: "Active" },
        });

        if (urls.length === 0) throw new Error("No URLs found for this user.");

        const urlIds = urls.map((url) => url.id);

        const [totalClicks, uniqueClicks, clicksByDate, analytics] =
          await Promise.all([
            Analytic.count({ where: { url_id: { [Op.in]: urlIds } } }),
            Analytic.count({
              where: { url_id: { [Op.in]: urlIds } },
              distinct: true,
              col: "ip_address",
            }),
            getClicksByDate(urlIds),
            Analytic.findAll({
              where: { url_id: { [Op.in]: urlIds } },
              attributes: ["user_agent", "ip_address"],
            }),
          ]);

        return {
          totalUrls: urls.length,
          totalClicks,
          uniqueClicks,
          clicksByDate,
          osType: detectOS(analytics),
          deviceType: detectDeviceType(analytics),
        };
      }
    );

    return successResponse(
      res,
      "Overall analytics fetched successfully",
      analyticsData
    );
  } catch (error) {
    console.error("Error in getOverallAnalytics:", error);
    return errorResponse(
      res,
      "No URLs found for this user.",
      null,
      StatusCodes.NOT_FOUND
    );
  }
};
