import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import passport from "passport";
import { createServer } from "http";

// Custom Imports
import Database from "./db/database.js";
import redisClient from "./utils/redisClient.js";
import DataBaseAssociations from "./utils/DataBaseAssociations.js";
import { passportStrategies } from "./middlewares/passportStrategies.js";
import socketHandlers from "./Sockets/SocketHandler.js";
import sockIo from "./socket.js";
import client from "./db/pgclient.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import publicRoutes from "./routes/public.route.js";
import postsRoutes from "./routes/posts.route.js";
import userRoutes from "./routes/user.route.js";
import commentRoutes from "./routes/comments.route.js";
import aiRoutes from "./routes/AI.route.js";
import messagingRoutes from "./routes/messaging/messaging.route.js";
import initMessageChangeListener from "./db/triggers/messages.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = sockIo.init(server);

// Constants
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

// Morgan for logging
app.use(morgan("dev"));

// Middlewares
app.use(cookieParser());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOrigins = process.env.WHITLIST_ORIGINS
  ? process.env.WHITLIST_ORIGINS.split(",").map((origin) => origin.trim())
  : [];
console.log({ allowedOrigins });
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Not allowed by CORS");
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://lh3.googleusercontent.com",
          "https://avatars.githubusercontent.com",
        ],
      },
    },
  })
);

// Rate Limiting (optional, uncomment if needed)
// import rateLimit from "express-rate-limit";
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { message: "Too many requests, please try again later." },
// });
// app.use("/api/", limiter);

// Passport setup
passportStrategies();
app.use(passport.initialize());

// Serve static files
app.use(
  express.static(path.join(__dirname, "/client/dist"), {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

// Database associations
DataBaseAssociations();

//DB changes listener
initMessageChangeListener();

// Socket.IO
io.on("connection", (socket) => {
  socket.on("error", (err) => console.error("Socket Error:", err));
});
socketHandlers(io);

// Healthcheck route
app.get("/health", async (req, res) => {
  const dbStatus = await Database.authenticate()
    .then(() => "connected")
    .catch(() => "disconnected");

  res.status(200).json({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    database: dbStatus,
    redis: redisClient.isReady ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messaging", messagingRoutes);

// Fallback for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

// Fallback for unmatched API route
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.statusCode || 500).json({
    message: error.statusCode !== 500 ? error.message : "Server Error",
  });
});

// Graceful shutdown
const shutdown = async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected.");

    await Database.close();
    console.log("Database connection closed.");

    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start the server after DB & Redis setup
Database.sync()
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
