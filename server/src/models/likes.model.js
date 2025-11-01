import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Post from "./posts/posts.model.js";

const Likes = db.define(
  "Like",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    likedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      index: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      index: true,
    },
  },
  {
    indexes: [
      {
        fields: ["likedBy"],
      },
      {
        fields: ["postId"],
      },
      {
        unique: true,
        fields: ["likedBy", "postId"],
      },
    ],
  }
);

Likes.belongsTo(Post, {
  as: "likedPost",
  foreignKey: "postId",
  onDelete: "CASCADE",
});
Post.hasMany(Likes, { as: "Likes", foreignKey: "postId" });

export default Likes;
