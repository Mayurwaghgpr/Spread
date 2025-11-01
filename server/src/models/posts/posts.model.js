import { DataTypes } from "sequelize";
import db from "../../config/database.js";

const Post = db.define("post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  previewImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.ENUM("draft", "published"),
    defaultValue: "draft",
  },
  cloudinaryPubId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publicationId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  publishedAt: {
    type: DataTypes.DATE,
  },
});
Post.beforeCreate((post) => {
  post.slug = post.title.toLowerCase().replace(/\s+/g, "-");
});

export default Post;
