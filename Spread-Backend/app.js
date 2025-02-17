import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import Database from "./utils/database.js";
// Routes
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js";
import userRouter from "./routes/user.route.js";
import publicRouter from "./routes/public.route.js";
import commentRouter from "./routes/comments.route.js";
import aiRouter from "./routes/AI.route.js";
import conversationRouter from "./routes/Conversation.route.js"
import messageRouter from "./routes/Messages.route.js";
import { passportStrategies } from "./middlewares/passportStrategies.js";
import User from "./models/user.js";
import Follow from "./models/Follow.js";
import Archive from "./models/Archive.js";
import Post from "./models/posts.js";
import Comments from "./models/Comments.js";
import Message from "./models/Messanger/Messages.js";
import Attachment from "./models/Messanger/Attachment.js";
import ReadReceipt from "./models/Messanger/ReadReceipt.js";
import Reaction from "./models/Messanger/Reaction.js";
import Conversation from "./models/Messanger/Conversation.js";
import Participant from "./models/Messanger/Participant.js";
import socketHandlers from "./Sockets/SocketHandler.js";

// Initialize dotenv
dotenv.config();

const app = express();
const server = createServer(app);
const Io = new Server(server, {
  cors: {
    origin: process.env.WHITLIST_ORIGINS, // Support multiple origins
    credentials: true,
  },
});

const port = process.env.PORT || 3000;
const __dirname = path.resolve();


app.use(cookieParser());
app.use(express.json());

// Serve Static Files (Place before routes)
app.use(express.static(path.join(__dirname, "/Spread-FrontEnd/dist")));



app.use("/auth", authRouter);
app.use("/public", publicRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/ai", aiRouter);
app.use('/messages', messageRouter);
app.use('/conversations', conversationRouter);

// Passport Configuration
passportStrategies(passport);
app.use(passport.initialize());

// Socket.IO Connection
socketHandlers(Io)


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


// Conversation and Participant many to many
Conversation.hasMany(Participant, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Participant.belongsTo(Conversation, { foreignKey: 'conversationId' });

User.hasMany(Participant, { foreignKey: 'userId', onDelete: 'CASCADE' });
Participant.belongsTo(User, { foreignKey: 'userId' });

// Conversation and Messages one to many
Conversation.hasMany(Message, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// User and Messages one to many
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages', onDelete: 'CASCADE' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

// Message and Attachments one to many
Message.hasMany(Attachment, { foreignKey: 'messageId', onDelete: 'CASCADE' });
Attachment.belongsTo(Message, { foreignKey: 'messageId' });

// Message and ReadReceipts one to many
Message.hasMany(ReadReceipt, { foreignKey: 'messageId', onDelete: 'CASCADE' });
ReadReceipt.belongsTo(Message, { foreignKey: 'messageId' });

User.hasMany(ReadReceipt, { foreignKey: 'userId', onDelete: 'CASCADE' });
ReadReceipt.belongsTo(User, { foreignKey: 'userId' });

// Message and Reactions one to many
Message.hasMany(Reaction, { foreignKey: 'messageId', onDelete: 'CASCADE' });
Reaction.belongsTo(Message, { foreignKey: 'messageId' });

User.hasMany(Reaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reaction.belongsTo(User, { foreignKey: 'userId' });

// Wildcard Route for Frontend
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.resolve("Spread-FrontEnd", "dist", "index.html"));
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.statusCode || 500).json({ message: error.message || "An error occurred" });
});

// Start Server
Database.sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`API is running at http://localhost:${port}`);
    });
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

export default app;
