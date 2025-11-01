import { DataTypes } from "sequelize";
import db from "../config/database.js";
import genUniqueUserName from "../utils/UserNameGenerator.js";

const User = db.define(
  "user",
  {
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
      defaultValue:
        "https://res.cloudinary.com/dvjs0twtc/image/upload/zjhgm5fjuyz1rcp3ahqz",
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
      type: DataTypes.ENUM("he/him", "she/her"),
      defaultValue: "he/him",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    profileLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedWith: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

function generateProfileLink(user) {
  return `${process.env.FRONT_END_URL}/profile/${user.username}/${user.id}`;
}

// beforeCreate — single DB insert
User.beforeCreate(async (user) => {
  const username = await genUniqueUserName(user.email);
  user.username = username;
  user.profileLink = generateProfileLink(user);
});

// afterUpdate — update profile link if username changes
User.afterUpdate(async (user) => {
  user.profileLink = generateProfileLink(user);
  await user.save();
});

export default User;
