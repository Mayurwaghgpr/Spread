import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Tag = db.define("Tag", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tagName: { type: DataTypes.STRING, allowNull: false },
});

export default Tag;
