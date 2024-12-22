import { DataTypes } from "sequelize";

import Database from "../utils/database.js";
import Comments from "./Comments.js";

const User = Database.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userImage: {
    type: DataTypes.STRING,
    defaultValue: "images/placeholderImages/ProfOutlook.png",
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pronouns: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  signedWith: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: "",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default User;
