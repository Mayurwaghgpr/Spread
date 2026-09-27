import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
dotenv.config();

let io;

const allowedOrigins = process.env.WHITELIST_ORIGINS
  ? process.env.WHITELIST_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

const sockIo = {
  init: (httpServer) => {
    if (io) return io; // prevent multiple inits

    io = new Server(httpServer, {
      connectionStateRecovery: {},
      cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });

    io.use((socket, next) => {
      let token = socket.handshake.auth?.token;
      if (token === "null" || token === "undefined" || !token) {
        token = null;
      }

      // Extract from Cookie header (for cookie-based sessions e.g. Google OAuth)
      if (!token && socket.handshake.headers?.cookie) {
        const match = socket.handshake.headers.cookie.match(/(?:^|;\s*)(?:AccessToken|accessToken)=([^;]+)/);
        if (match) {
          token = decodeURIComponent(match[1]);
        }
      }

      // Extract from Authorization header
      if (!token && socket.handshake.headers?.authorization) {
        token = socket.handshake.headers.authorization.replace(/^Bearer\s+/i, "");
      }

      // Extract from query params fallback
      if (!token && socket.handshake.query?.token) {
        const queryToken = socket.handshake.query.token;
        if (queryToken && queryToken !== "null" && queryToken !== "undefined") {
          token = queryToken;
        }
      }

      if (!token || token === "null" || token === "undefined") {
        console.warn(`[Socket.io] Auth failed for socket ${socket.id}: No token provided`);
        return next(new Error("Authentication required"));
      }

      try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = payload?.id || payload?.user?.id;
        if (!userId) {
          console.warn(`[Socket.io] Auth failed for socket ${socket.id}: No user ID in token payload`);
          return next(new Error("Authentication required"));
        }
        socket.data.userId = userId;
        console.log(`[Socket.io] Authenticated socket ${socket.id} for user ${userId}`);
        return next();
      } catch (err) {
        console.warn(`[Socket.io] Auth failed for socket ${socket.id}: ${err.message}`);
        return next(new Error("Authentication required"));
      }
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
