import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import Database from "./utils/database.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// Routes
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import userRouter from "./routes/user.route.js";
import publicRouter from "./routes/public.route.js";
import commentRouter from "./routes/comments.route.js";
import aiRouter from "./routes/AI.route.js";
import { passportStrategies } from "./middlewares/passportStrategies.js";
import socketHandlers from "./Sockets/SocketHandler.js";
import redisClient from "./utils/redisClient.js";
import DataBaseAssociations from "./utils/DataBaseAssociations.js";
import Archive from "./models/Archive.js";


// Initialize dotenv
dotenv.config();
const app = express();
const server = createServer(app);
const allowedOrigins = process.env.WHITLIST_ORIGINS?.split(","); 
const Io = new Server(server, {
  connectionStateRecovery:{},
  cors: {
    origin: allowedOrigins, // Support multiple origins
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
  },
}); 

const port = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cors({
  origin: allowedOrigins, // Support multiple origins
    methods:["GET","POST","PUT","PATCH","DELETE"],
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
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
  }
}));
// Reate limmiter 
// app.use("/", rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: { message: "Too many requests, please try again later." },
//   headers: true,
// })); 
app.use(cookieParser());

// Serve Static Files (Place before routes)
// Serve Static Files
app.use(express.static(path.join(__dirname, "/client/dist"), { maxAge: "1d" }));



app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/ai", aiRouter);



// Passport Configuration
passportStrategies(passport);
app.use(passport.initialize());

// Socket.IO Connection
socketHandlers(Io)

// Associations
DataBaseAssociations()

// Handle React Routes (After API Routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist", "index.html"));
});

// Wildcard Route for Frontend
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" })); 
app.use((error, req, res, next) => {
  console.error("Error:", error);
  console.log(error.statusCode)
  res.status(error.statusCode || 500).json({ message: error.statusCode!==500 ?error.message :"Server Error" });
});



// Graceful Shutdown Handling
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
    process.exit(1); // Exiting the process on DB error
  });
