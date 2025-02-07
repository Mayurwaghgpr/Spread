// redisClient.js
import dotenv from"dotenv"
import {createClient} from "redis";
dotenv.config();
const redisClient = createClient( process.env.NODE_ENV === "production"&&{url:process.env.REDIS_URL,  socket: {
    tls: true, // Required for Render Redis
  }});


redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;
