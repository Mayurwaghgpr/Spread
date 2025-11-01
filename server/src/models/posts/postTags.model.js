import { DataTypes } from "sequelize";
import db from "../../config/database.js";
const PostTag = db.define("PostTage", {
  postId: {
    type: DataTypes.UUID,
  },
  tagId: {
    type: DataTypes.UUID,
  },
});
export default PostTag;
