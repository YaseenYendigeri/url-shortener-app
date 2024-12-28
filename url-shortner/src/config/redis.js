import process from "node:process";
import redis from "redis";
import { REDIS_URI } from "#src/config/env";

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

async function disconnectRedisClient() {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log("Redis client disconnected...");
  } else {
    console.log("Redis client is not connected");
  }
}

export { initializeRedisClient, disconnectRedisClient };
