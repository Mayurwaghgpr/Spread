import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisOptions =
  process.env.NODE_ENV === "production" ? { url: process.env.REDIS_URL } : {};

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis Client Error:", err));

export default redisClient;
