import { DataTypes } from "sequelize";

import Database from "../utils/database.js";
import Comments from "./Comments.js";

const User = Database.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  displayName:{
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
    type: DataTypes.ENUM('he/him', 'she/her', 'they/them', ''),
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
