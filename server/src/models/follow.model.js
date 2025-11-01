import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Follow = db.define(
  "Follow",
  {
    followerId: { type: DataTypes.UUID },
    followedId: { type: DataTypes.UUID },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["followerId", "followedId"], // prevent duplicate follows
      },
    ],
  }
);

export default Follow;
