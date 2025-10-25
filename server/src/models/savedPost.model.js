import { DataTypes } from "sequelize";
import db from "../config/database.js";

const SavedPost = db.define(
  "SavedPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    indexes: [
      // Composite index on postId and userId
      {
        name: "postId_userId_index",
        fields: ["postId", "userId"],
        unique: true,
      },
      {
        name: "userId_index",
        fields: ["userId"],
      },

      {
        name: "postId_index",
        fields: ["postId"],
      },
    ],
  }
);

export default SavedPost;
