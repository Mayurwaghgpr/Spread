import { DataTypes } from "sequelize";
import Database from "../utils/database.js";
import User from "./user.js";
import Post from "./posts.js";
import Comments from "./Comments.js";

const LikeComment = Database.define("LikeComment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  likedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

LikeComment.belongsTo(Comments, {
  as: "likedComment",
  foreignKey: "commentId",
  onDelete: "CASCADE",
});
Comments.hasMany(LikeComment, { as: "commentLikes", foreignKey: "commentId" });

export default LikeComment;
