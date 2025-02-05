import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import Database from "./utils/database.js";
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import userRouter from "./routes/user.route.js";
import publiRouter from "./routes/public.route.js";
import commentRouter from "./routes/comments.route.js";
import { multerFileUpload } from "./middlewares/multer.middleware.js";
// import { v2 as cloudinary } from "cloudinary";

import Post from "./models/posts.js";
import User from "./models/user.js";
import Follow from "./models/Follow.js";
import Archive from "./models/Archive.js";
import { passportStrategies } from "./middlewares/passportStartegies.js";
import Comments from "./models/Comments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
const whitelistOrigins = process.env.WHITELIST_ORIGINS?.split(",").map(
  (origin) => origin.trim()
);
// Middleware
app.use(
  cors({
    origin: [
      "https://spread-45xk.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ], // Ensure this is the exact frontend URL
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true, // Allow cookies
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/images",
  express.static(path.join(__dirname, "Spread-Backend", "images"))
);
// app.use();

//Login with google/gitub
passportStrategies(passport);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/auth", authRouter);
app.use("/public", publiRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);

// Associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

// User follower and following associations
User.belongsToMany(User, {
  through: Follow,
  as: "Followers",
  foreignKey: "followedId",
});
User.belongsToMany(User, {
  through: Follow,
  as: "Following",
  foreignKey: "followerId",
});
Follow.belongsTo(User, { as: "Follower", foreignKey: "followerId" });
Follow.belongsTo(User, { as: "Followed", foreignKey: "followedId" });

// User and Post Archive association
User.belongsToMany(Post, {
  through: Archive,
  as: "SavedPosts",
  foreignKey: "UserId",
  otherKey: "PostId", // Define the other key to be used in the junction table
});

Post.belongsToMany(User, {
  through: Archive,
  as: "UsersSaved",
  foreignKey: "PostId",
  otherKey: "UserId", // Define the other key to be used in the junction table
});

Archive.belongsTo(User, {
  as: "User",
  foreignKey: "UserId",
});

Archive.belongsTo(Post, {
  as: "Post",
  foreignKey: "PostId",
});
// Self-referencing association for child comments
Comments.hasMany(Comments, {
  foreignKey: "topCommentId",
  as: "reply",
});
Comments.belongsTo(Comments, {
  foreignKey: "topCommentId",
  as: "topComment",
});

// Associations for User and Post (if applicable)
Comments.belongsTo(User, {
  foreignKey: "UserId",
  as: "commenter",
});
User.hasMany(Comments, {
  foreignKey: "UserId",
  as: "comments",
});

// A Post can have many Comments
Post.hasMany(Comments, {
  foreignKey: "postId",
  as: "comments",
  onDelete: 'CASCADE',
});

// A Comment belongs to a Post
Comments.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",

});

app.use(express.static(path.join(__dirname, "/Spread-FrontEnd/dist")));
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next(); // Skip for API routes
  res.sendFile(path.resolve("Spread-FrontEnd", "dist", "index.html"));
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  const status = error.statusCode || 500;
  const message = error.message || "An error occurred";
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Database Sync and Server Start
Database.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`API is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    if (process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
  });
export default app;
