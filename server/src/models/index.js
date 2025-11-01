import User from "./user.model.js";
import Follow from "./follow.model.js";
import Post from "./posts/posts.model.js";
import PostBlock from "./posts/postBlock.model.js";
import Tag from "./tags.model.js";
import PostTag from "./posts/postTags.model.js";
import SavedPost from "./savedPost.model.js";
import Comments from "./comments.model.js";
import Notification from "./notification.model.js";

// Messaging Models
import Conversation from "./messaging/conversation.model.js";
import Members from "./messaging/members.model.js";
import Messages from "./messaging/messages.model.js";
import Attachments from "./messaging/attachments.model.js";
import ReadReceipt from "./messaging/readReceipt.model.js";

// ================== FOLLOW SYSTEM ==================
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

Follow.belongsTo(User, {
  as: "Follower",
  foreignKey: "followerId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Follow.belongsTo(User, {
  as: "Followed",
  foreignKey: "followedId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ================== POSTS & TAGS ==================
User.hasMany(Post, { foreignKey: "authorId", as: "posts" });
Post.belongsTo(User, { foreignKey: "authorId", as: "author" });

// Post blocks (paragraphs, code snippets, etc.)
Post.hasMany(PostBlock, { as: "postBlocks", foreignKey: "postId" });
PostBlock.belongsTo(Post, { as: "post", foreignKey: "postId" });

// Post & Tag many-to-many
Post.belongsToMany(Tag, { as: "tags", through: PostTag });
Tag.belongsToMany(Post, { as: "taggedPosts", through: PostTag });

// ================== SAVED POSTS ==================
User.belongsToMany(Post, {
  through: SavedPost,
  foreignKey: "userId",
  otherKey: "postId",
  as: "savedPostsList",
});
Post.belongsToMany(User, {
  through: SavedPost,
  foreignKey: "postId",
  otherKey: "userId",
  as: "savedByUsers",
});
SavedPost.belongsTo(User, { as: "user", foreignKey: "userId" });
SavedPost.belongsTo(Post, { as: "post", foreignKey: "postId" });

// ================== COMMENTS ==================
Comments.belongsTo(User, { foreignKey: "userId", as: "commenter" });
User.hasMany(Comments, { foreignKey: "userId", as: "comments" });

Comments.belongsTo(Post, { foreignKey: "postId", as: "post" });
Post.hasMany(Comments, {
  foreignKey: "postId",
  as: "comments",
  onDelete: "CASCADE",
});

// Self referencing for replies
Comments.hasMany(Comments, {
  foreignKey: "topCommentId",
  as: "replies",
});
Comments.belongsTo(Comments, {
  foreignKey: "topCommentId",
  as: "topComment",
});

// ================== MESSAGING SYSTEM ==================

// Conversations - Members - Users
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

// Messages
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

// Attachments
Messages.hasOne(Attachments, {
  foreignKey: "messageId",
  as: "attachment",
  onDelete: "CASCADE",
});
Attachments.belongsTo(Messages, {
  foreignKey: "messageId",
  as: "message",
  onDelete: "CASCADE",
});

// Read Receipts
Messages.hasMany(ReadReceipt, {
  foreignKey: "messageId",
  as: "readReceipts",
  onDelete: "CASCADE",
});
ReadReceipt.belongsTo(Messages, {
  foreignKey: "messageId",
  as: "readReceipt",
  onDelete: "CASCADE",
});

// ================== NOTIFICATIONS ==================
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

// ================== EXPORT MODELS ==================
export {
  User,
  Follow,
  Post,
  PostBlock,
  Tag,
  PostTag,
  SavedPost,
  Comments,
  Conversation,
  Members,
  Messages,
  Attachments,
  ReadReceipt,
  Notification,
};
