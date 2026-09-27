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
    // This is intentionally public. The corresponding non-extractable private
    // key is generated and kept in the user's browser, never on this server.
    encryptionPublicKey: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    // Spread Profile Canvas fields
    currentFocus: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    aboutStory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    interests: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    socialLinks: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    pinnedPostId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    profilePreferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        showStats: true,
        showInterests: true,
        showAiSummary: true,
      },
    },
    aiProfileSummary: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

function generateProfileLink(user) {
  const username = user.username || user.dataValues?.username;
  const id = user.id || user.dataValues?.id;
  if (!username || !id) return user.profileLink || null;
  return `${process.env.FRONT_END_URL}/profile/@${username}/${id}`;
}

// beforeCreate — single DB insert
User.beforeCreate(async (user) => {
  if (!user.username) {
    const username = await genUniqueUserName(user.email);
    user.username = username;
  }
  user.profileLink = generateProfileLink(user);
});

// beforeUpdate — update profile link if username changes without triggering infinite loop
User.beforeUpdate((user) => {
  if (user.changed("username")) {
    user.profileLink = generateProfileLink(user);
  }
});

export default User;
