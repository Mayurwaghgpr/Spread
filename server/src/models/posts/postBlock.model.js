import { DataTypes, ENUM } from "sequelize";
import db from "../../config/database.js";
import Post from "./posts.model.js";

const PostBlock = db.define("PostBlock", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: ENUM([
      "text",
      "heading",
      "paragraph",
      "image",
      "code_snippet",
      "link",
      "url",
      "list",
      "quote",
    ]),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
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
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

export default PostBlock;
