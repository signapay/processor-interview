import Redis from "ioredis";
import { config } from "../../../config/config";

if (!config.REDIS_URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

const redisClient = new Redis(config.REDIS_URL);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

async function setRedisValue(key: string, value: string) {
  try {
    await redisClient.set(key, value);
    console.log(`Key set: ${key} = ${value}`);
  } catch (err) {
    console.error("Error setting key in Redis:", err);
  }
}

async function getRedisValue(key: string) {
  try {
    const value = await redisClient.get(key);
    console.log(`Key retrieved: ${key} = ${value}`);
    return value;
  } catch (err) {
    console.error("Error getting key from Redis:", err);
  }
}

setRedisValue("sampleKey", "sampleValue");
getRedisValue("sampleKey");

export { redisClient };
