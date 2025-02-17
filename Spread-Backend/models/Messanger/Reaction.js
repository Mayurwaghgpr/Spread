import Database from "../../utils/database.js";
import { DataTypes } from "sequelize";
// Reaction Model
const Reaction = Database.define('Reaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  reactionType: {
    type: DataTypes.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry'),
    allowNull: false
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

export default Reaction;
