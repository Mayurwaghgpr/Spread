import { DataTypes } from "sequelize";
import db from "../config/database.js";

import Post from "./posts.model.js";

const PostContent = db.define("PostContent", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  otherInfo: {
    type: DataTypes.STRING,
    defaultValue: "text content",
  },
  cloudinaryPubId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Post,
      key: "id",
    },
    onDelete: "CASCADE", // Ensures deletion of related content on post deletion
    onUpdate: "CASCADE", // Ensures cascading updates on postId changes
  },
});

PostContent.belongsTo(Post, { as: "post", foreignKey: "postId" });
Post.hasMany(PostContent, { as: "postContent", foreignKey: "postId" });

export default PostContent;
