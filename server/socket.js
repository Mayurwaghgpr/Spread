import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

let io;

const allowedOrigins = process.env.WHITLIST_ORIGINS
  ? process.env.WHITLIST_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const sockIo = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      connectionStateRecovery: {},
      cors: {
        origin: allowedOrigins,
        methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("ioSocket not initialized");
    }
    return io;
  },
};

export default sockIo;
