import { DataTypes } from "sequelize";
import Database from "../../utils/database.js";

// Attachment Model
const Attachment = Database.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.ENUM('image', 'video', 'file', 'audio'),
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING
  }
});

export default Attachment;