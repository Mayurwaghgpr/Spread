import Archive from "../models/Archive.js";
import Comments from "../models/Comments.js";
import Follow from "../models/Follow.js";
import Attachments from "../models/messaging/Attachments.js";
import Conversation from "../models/messaging/Conversation.js";
import Members from "../models/messaging/Members.js";
import Messages from "../models/messaging/Messages.js";
import ReadReceipt from "../models/messaging/ReadReceipt.js";
import Post from "../models/posts.js";
import User from "../models/user.js";
import Notification from "../models/Notification.js";

const DataBaseAssociations = () => {
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
    as: "savedPosts",
    foreignKey: "userId",
    otherKey: "postId", // Define the other key to be used in the junction table
  });

  Post.belongsToMany(User, {
    through: Archive,
    as: "usersSaved",
    foreignKey: "postId",
    otherKey: "userId", // Define the other key to be used in the junction table
  });

  Archive.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });

  Archive.belongsTo(Post, {
    as: "post",
    foreignKey: "postId",
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
    foreignKey: "userId",
    as: "commenter",
  });
  User.hasMany(Comments, {
    foreignKey: "userId",
    as: "comments",
  });

  // A Post can have many Comments
  Post.hasMany(Comments, {
    foreignKey: "postId",
    as: "comments",
    onDelete: "CASCADE",
  });

  // A Comment belongs to a Post
  Comments.belongsTo(Post, {
    foreignKey: "postId",
    as: "post",
  });

  Conversation.belongsToMany(User, {
    through: Members,
    as: "members",
    foreignKey: "conversationId",
    onDelete: "CASCADE",
  });
  User.belongsToMany(Conversation, {
    through: Members,
    as: "conversations",
    foreignKey: "memberId",
    onDelete: "CASCADE",
  });

  Conversation.hasMany(Members, { foreignKey: "conversationId" });

  Members.belongsTo(User, { foreignKey: "memberId", onDelete: "CASCADE" });
  Members.belongsTo(Conversation, { foreignKey: "conversationId" });

  User.hasMany(Messages, { foreignKey: "senderId", as: "messages" });
  Conversation.hasMany(Messages, {
    foreignKey: "conversationId",
    as: "messages",
  });

  Messages.belongsTo(User, { foreignKey: "senderId", as: "sender" });
  Messages.belongsTo(Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
    onDelete: "CASCADE",
  });

  Attachments.belongsTo(Messages, {
    foreignKey: "messageId",
    as: "message",
    onDelete: "CASCADE",
  });
  Messages.hasOne(Attachments, {
    foreignKey: "messageId",
    as: "attachment",
    onDelete: "CASCADE",
  });

  ReadReceipt.belongsTo(Messages, {
    foreignKey: "messageId",
    as: "readReceipt",
    onDelete: "CASCADE",
  });
  Messages.hasMany(ReadReceipt, {
    foreignKey: "messageId",
    as: "readReceipts",
    onDelete: "CASCADE",
  });

  Notification.belongsTo(User, {
    foreignKey: "receiverId",
    as: "receiver",
    onDelete: "CASCADE",
  });
  Notification.belongsTo(User, {
    as: "actor",
    foreignKey: "actorId",
    allowNull: true,
  });
};

export default DataBaseAssociations;
