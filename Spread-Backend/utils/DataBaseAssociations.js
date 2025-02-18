import Archive from "../models/Archive.js";
import Comments from "../models/Comments.js";
import Follow from "../models/Follow.js";
import Attachment from "../models/Messanger/Attachment.js";
import Conversation from "../models/Messanger/Conversation.js";
import Message from "../models/Messanger/Messages.js";
import Participant from "../models/Messanger/Participant.js";
import Reaction from "../models/Messanger/Reaction.js";
import ReadReceipt from "../models/Messanger/ReadReceipt.js";
import Post from "../models/posts.js";
import User from "../models/user.js";

export const dataBaseAssociations = () => {
    
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

}