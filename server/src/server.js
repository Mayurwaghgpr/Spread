import redisClient from "./utils/redisClient.js";

import db from "./config/database.js";
import dotenv from "dotenv";
import { server } from "./app.js";
import sockIo from "./socket.js";
import socketHandlers from "./socket/socket-handler.js";
dotenv.config();
const port = process.env.PORT || 3000;
export const io = sockIo.init(server);

socketHandlers();

// Start the server after DB & Redis setup
db.sync()
  .then(async () => {
    await redisClient.connect();
    console.log("Redis client connected.");
    server.listen(port, () => {
      console.log(`API is running at http://localhost:${port}`);
    });
    console.log("Database connected and synchronized successfully.");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });
