import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import passport from "passport";

// Custom Imports
import Database from "./config/database.js";
import redisClient from "./utils/redisClient.js";
import DataBaseAssociations from "./utils/DataBaseAssociations.js";
import { passportStrategies } from "./middlewares/passport.middleware.js";
import { createServer } from "http";
// Routes
import authRoutes from "./routes/auth.route.js";
import publicRoutes from "./routes/public.route.js";
import postsRoutes from "./routes/posts.route.js";
import userRoutes from "./routes/user.route.js";
import commentRoutes from "./routes/comments.route.js";
import aiRoutes from "./routes/aI.route.js";
import messagingRoutes from "./routes/messaging/messaging.route.js";
import initMessageChangeListener from "./db/triggers/messages.js";
import notificationRoutes from "./routes/notification.route.js";

dotenv.config();
export const app = express();

export const server = createServer(app);
// Constants
// const __dirname = path.resolve();

// Morgan for logging
app.use(morgan("dev"));

// Middlewares
app.use(cookieParser());
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOrigins = process.env.WHITELIST_ORIGINS
  ? process.env.WHITELIST_ORIGINS.split(",").map((origin) => origin.trim())
  : [];
app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
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

// Passport setup
passportStrategies();
app.use(passport.initialize());

// Database associations
DataBaseAssociations();

//DB changes listener
initMessageChangeListener();

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
app.use("/api/notifications", notificationRoutes);

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
