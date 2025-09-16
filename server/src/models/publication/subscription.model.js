import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Subscriptions = db.define("subscriptions", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subscriber_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  publication_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  is_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  amount_paid: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  subscribed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Subscriptions;
