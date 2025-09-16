import { DataTypes } from "sequelize";
import db from "../../config/database.js";

const ReadReceipt = db.define("ReadReceipt", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM(["Pending", "Sent", "Received", "Seen"]),
    default: "Pending",
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: false,
    require: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    require: true,
  },
});

export default ReadReceipt;
