import { DataTypes } from "sequelize";
import db from "../config/database.js";
import genUniqueUserName from "../utils/UserNameGenerator.js";

const User = db.define("user", {
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
  profileLink: {
    type: DataTypes.STRING,
    defaultValue: "",
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

function generateProfileLink(user) {
  return `${process.env.FRONT_END_URL}/profile/${user.username}/${user.id}`;
}
//Set unique username and generate profile link
User.afterCreate(async (user) => {
  const username = await genUniqueUserName(user.email); //generate unique username
  user.username = username;

  user.profileLink = generateProfileLink(user); //generate link
  await user.save();
});

User.afterBulkUpdate(async (options) => {
  // Re-fetch affected users using the options.where filter
  const user = await User.findOne({ where: options.where });

  user.profileLink = generateProfileLink(JSON.parse(JSON.stringify(user)));

  await user.save(); // Triggers `beforeUpdate` and updates DB
});

export default User;
