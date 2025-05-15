import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
// import rateLimit from "express-rate-limit";

import { createServer } from "http";
import Database from "./utils/database.js";
import redisClient from "./utils/redisClient.js";
import DataBaseAssociations from "./utils/DataBaseAssociations.js";
import { passportStrategies } from "./middlewares/passportStrategies.js";
import socketHandlers from "./Sockets/SocketHandler.js";
import sockIo from "./socket.js";
import passport from "passport";

dotenv.config();
const app = express();
const server = createServer(app);
export const io = sockIo.init(server);

const port = process.env.PORT || 3000;
const __dirname = path.resolve();

//  morgan  routes loging
app.use(morgan("dev"));

const allowedOrigins = process.env.WHITLIST_ORIGINS?.split(",");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(cookieParser());
app.use(hpp());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "img-src": [
        "'self'",
        "data:",
        "https://res.cloudinary.com",
        "https://lh3.googleusercontent.com",
        "https://avatars.githubusercontent.com"
      ]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" }
}));

//  Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { message: "Too many requests, please try again later." },
// });
// app.use("/api/", limiter);

// Passport Setup
passportStrategies()
app.use(passport.initialize());


// Static Files
app.use(express.static(path.join(__dirname, "/client/dist"), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Database Associations
DataBaseAssociations();

// Sockets
io.on("connection", (socket) => {
  socket.on("error", (err) => console.error("Socket Error:", err));
});
socketHandlers(io);

app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: Database.authenticate() ? 'connected' : 'disconnected',
    redis: redisClient.isReady ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthcheck);
});

// Dynamic Route Loader
const loadRoute = (route, filePath) => {
  app.use(route, async (req, res, next) => {
    const module = await import(filePath);
    return module.default(req, res, next);
  });
};

//Routes
loadRoute("/api/auth", "./routes/auth.route.js");
loadRoute("/api/public", "./routes/public.route.js");
loadRoute("/api/posts", "./routes/posts.route.js");
loadRoute("/api/user", "./routes/user.route.js");
loadRoute("/api/comment", "./routes/comments.route.js");
loadRoute("/api/ai", "./routes/AI.route.js");
loadRoute("/api/messaging", "./routes/messaging/messaging.route.js");

// Fallback for React (client side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

//Fallback for unmatched API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

//Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.statusCode || 500).json({
    message: error.statusCode !== 500 ? error.message : "Server Error"
  });
});

// Graceful Shutdown
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

// Start Server
Database.sync()
  .then(() => {
    server.listen(port, async () => {
      await redisClient.connect();
      console.log("Connected to Redis");
      console.log(`API is running at http://localhost:${port}`);
    });
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
