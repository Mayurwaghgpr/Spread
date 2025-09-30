import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

let io;

const allowedOrigins = process.env.WHITELIST_ORIGINS
  ? process.env.WHITELIST_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const sockIo = {
  init: (httpServer) => {
    console.log({ allowedOrigins });

    if (io) return io; // prevent multiple inits

    io = new Server(httpServer, {
      connectionStateRecovery: {},
      cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      socket.on("disconnect", () =>
        console.log(`Socket disconnected: ${socket.id}`)
      );
    });

    return io;
  },
  getIo: () => {
    if (!io) throw new Error("ioSocket not initialized");
    return io;
  },
};

export default sockIo;
