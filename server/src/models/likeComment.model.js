import { DataTypes } from "sequelize";

import Comments from "./comments.model.js";
import db from "../config/database.js";

const LikeComment = db.define("LikeComment", {
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
