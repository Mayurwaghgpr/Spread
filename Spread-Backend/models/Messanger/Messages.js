import Database from "../../utils/database.js";
import { DataTypes } from "sequelize";


const Message = Database.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Conversations',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  receiverId: {
        type: DataTypes.UUID,
  allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  onDelete: 'CASCADE'
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

export default Message;

