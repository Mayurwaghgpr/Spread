import { DataTypes } from "sequelize";
import Database from "../db/database.js";

const Notify = Database.define("Notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  actorId: {
    type: DataTypes.UUID,
    allowNull: true, // NULL for system notifications
  },
  type: {
    type: DataTypes.ENUM([
      "like",
      "comment",
      "follow",
      "mention",
      "message",
      "repost",
      "tag",
      "system",
    ]),
    allowNull: false,
  },
  entityId: {
    type: DataTypes.UUID,
    allowNull: true, // NULL if not related to a specific entity
  },
  entityType: {
    type: DataTypes.ENUM("post", "comment", "user", "system"),
    allowNull: true, // NULL for system notifications
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("unread", "read"),
    defaultValue: "unread",
  },
});

export default Notify;
