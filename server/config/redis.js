
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

export const connectRedis = async () => {
  if (redisClient.isOpen) return;

  await redisClient.connect();
  console.log("Redis connected successfully");
};

export default redisClient;