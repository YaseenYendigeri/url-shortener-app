import process from "node:process";
import redis from "redis";
import REDIS_URI from "#src/config/env.js";

const redisClient = redis.createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function initializeRedisClient() {
  if (redisClient.isOpen) {
    return redisClient;
  }

  await redisClient.connect();
  await redisClient.ping();
  console.log("Connected to Redis");

  return redisClient;
}

export { initializeRedisClient };
