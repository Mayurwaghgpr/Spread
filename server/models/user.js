import { DataTypes } from "sequelize";
import Database from "../db/database.js";

const User = Database.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userImage: {
    type: DataTypes.STRING,
    defaultValue: `https://res.cloudinary.com/dvjs0twtc/image/upload/zjhgm5fjuyz1rcp3ahqz`,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cloudinaryPubId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pronouns: {
    type: DataTypes.ENUM(["he/him", "she/her"]),
    defaultValue: "he/him",
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
