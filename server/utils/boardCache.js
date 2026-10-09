
import redisClient from "../config/redis.js";

const CACHE_TTL = 60; // seconds

export const getCachedBoards = async (workspaceId) => {
  try {
    const key = `workspace:${workspaceId}:boards`;
    const cached = await redisClient.get(key);

    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Redis cache read error:", error.message);
    return null; // Fall back to MongoDB
  }
};

export const cacheBoards = async (workspaceId, boards) => {
  try {
    const key = `workspace:${workspaceId}:boards`;

    await redisClient.setEx(
      key,
      CACHE_TTL,
      JSON.stringify(boards)
    );
  } catch (error) {
    console.error("Redis cache write error:", error.message);
  }
};

export const invalidateWorkspaceBoards = async (workspaceId) => {
  try {
    const key = `workspace:${workspaceId}:boards`;
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis cache invalidation error:", error.message);
  }
};