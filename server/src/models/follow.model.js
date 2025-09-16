import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Follow = db.define("Follow", {
  followerId: DataTypes.UUID,
  followedId: DataTypes.UUID,
});

export default Follow;
