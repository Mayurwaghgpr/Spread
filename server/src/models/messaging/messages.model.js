import { DataTypes } from "sequelize";
import db from "../../config/database.js";

const Messages = db.define("Messages", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    // An E2EE envelope, never plaintext. See client/src/utils/e2ee.js.
    type: DataTypes.JSONB,
    allowNull: false,
  },
  conversationId: {
    type: DataTypes.UUID,
    require: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    require: true,
  },
  replyedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: null,
  },
});

export default Messages;
