import { Op } from "sequelize";
import moment from "moment";
import { db } from "#src/models/index";
const RateLimit = db.RateLimit;
import { RATE_LIMIT_WINDOW, MAX_REQUESTS } from "#src/config/env";

export const checkRateLimit = async (userId) => {
  const currentTime = moment();
  const windowStart = currentTime
    .clone()
    .subtract(RATE_LIMIT_WINDOW, "minutes")
    .toDate();

  try {
    let rateLimit = await RateLimit.findOne({
      where: {
        user_id: userId,
        endpoint: "/api/v1/url/shorten",
        window_start: { [Op.gte]: windowStart },
      },
    });

    if (rateLimit) {
      if (rateLimit.request_count >= MAX_REQUESTS) {
        return true;
      }
      rateLimit.request_count += 1;
      await rateLimit.save();
    } else {
      await RateLimit.create({
        user_id: userId,
        endpoint: "/api/v1/url/shorten",
        window_start: currentTime.toDate(),
        request_count: 1,
      });
    }

    return false;
  } catch (error) {
    console.error("Error in rate limit middleware:", error);
    throw new Error("Rate limit check failed.");
  }
};
