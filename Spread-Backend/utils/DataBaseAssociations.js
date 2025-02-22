import Archive from "../models/Archive.js";
import Comments from "../models/Comments.js";
import Follow from "../models/Follow.js";
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

}