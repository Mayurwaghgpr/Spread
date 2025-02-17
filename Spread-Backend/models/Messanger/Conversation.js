import Database from "../../utils/database.js";
import { DataTypes } from "sequelize";
// Conversation Model
const Conversation = Database.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('direct', 'group'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  }
});

export default Conversation;
