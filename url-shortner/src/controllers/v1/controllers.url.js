import { generateShortUrl } from "#src/utils/utils";
import { checkRateLimit } from "#src/middlewares/rateLimit";
import { db } from "#src/models/index";
import { errorResponse, successResponse } from "#src/utils/response";
import { StatusCodes } from "http-status-codes";
import { initializeRedisClient } from "#src/config/redis";
import axios from "axios";
const Url = db.Url;
const Analytic = db.Analytic;
export const shortenUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
  const userId = req.user.id;

  try {
    const rateLimitExceeded = await checkRateLimit(userId);
    if (rateLimitExceeded) {
      return errorResponse(
        res,
        "Rate limit exceeded. Try again later.",
        null,
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    const shortUrl = generateShortUrl(customAlias);

    const url = await Url.create({
      long_url: longUrl,
      short_url: shortUrl,
      custom_alias: customAlias ?? shortUrl,
      topic: topic.toLowerCase(),
      user_id: userId,
      status: "Active",
    });

    return successResponse(
      res,
      "Short URL created successfully.",
      {
        shortUrl: `${process.env.BASE_URL}/${shortUrl}`,
        createdAt: url.createdAt,
      },
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating short URL:", error);
    return errorResponse(
      res,
      "Internal server error.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const redirectShortUrl = async (req, res) => {
  const { alias } = req.params;
  try {
    const redisClient = await initializeRedisClient();

    const cachedLongUrl = await redisClient.get(`shortUrl:${alias}`);
    if (cachedLongUrl) {
      return res.redirect(cachedLongUrl);
    }

    const url = await Url.findOne({
      where: { custom_alias: alias, status: "Active" },
    });

    if (!url) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Short URL not found or expired.",
      });
    }
    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const geolocation = [geoResponse?.data?.lat, geoResponse?.data.lon];

    await Analytic.create({
      url_id: url.id,
      user_agent: userAgent,
      ip_address: ipAddress,
      geo_location: {
        type: "Point",
        coordinates: geolocation,
      },
    });

    await redisClient.setEx(`shortUrl:${alias}`, 3600, url.long_url);

    return res.redirect(url.long_url);
  } catch (error) {
    console.error("Error creating short URL:", error);
    return errorResponse(
      res,
      "Internal server error.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
