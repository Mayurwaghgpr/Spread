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
User.afterCreate(async (user) => {
  user.profileLink = generateProfileLink(user);
  await user.save();
});

User.afterBulkUpdate(async (options) => {
  // Re-fetch affected users using the options.where filter
  const user = await User.findOne({ where: options.where });

  user.profileLink = generateProfileLink(JSON.parse(JSON.stringify(user)));

  await user.save(); // Triggers `beforeUpdate` and updates DB
});

export default User;
