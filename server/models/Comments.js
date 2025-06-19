import { DataTypes } from "sequelize";
import Database from "../db/database.js";


const Comments = Database.define("Comment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,

  },
  topCommentId: {
    type: DataTypes.UUID,
    allowNull: true, // Null for top-level comments
  },
  replyTo: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
 pind: {
  type: DataTypes.BOOLEAN,
  allowNull: true,
  defaultValue: false,
},

        
});

export default Comments;
