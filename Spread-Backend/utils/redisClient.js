import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisOptions = process.env.NODE_ENV === "production"
  ? { url: process.env.REDIS_URL }
  : {};

const redisClient = createClient(redisOptions);

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

await redisClient.connect();

console.log("Connected to Redis");

export default redisClient;
