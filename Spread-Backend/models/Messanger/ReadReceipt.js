import Database from "../../utils/database.js";
import { DataTypes } from "sequelize";
// ReadReceipt Model
const ReadReceipt = Database.define('ReadReceipt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  readAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Messages',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

export default ReadReceipt;
