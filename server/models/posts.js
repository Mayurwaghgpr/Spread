import { DataTypes } from "sequelize";
import Database from "../utils/database.js";

const Post = Database.define("post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  previewImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("draft", "published"),
    default:"draft"
  },
  topic: {
    type: DataTypes.STRING,
    defaultValue: "general",
    allowNull: false,
  },
  cloudinaryPubId: {
      type: DataTypes.STRING,
      allowNull: true
  },
  publicationId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  publishedAt: {
    type: DataTypes.DATE,
   }
});

export default Post;
