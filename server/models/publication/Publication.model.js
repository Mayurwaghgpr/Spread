import { DataTypes } from "sequelize";
import Database from "../../utils/database.js";

const Publication = Database.define("publication", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  publication_name: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    category: {
          type: DataTypes.TEXT,
  },
    description: {
    type: DataTypes.TEXT,
    },
  created_by: {
    type: DataTypes.UUID,
        allowNull: false,
    },
 
});

export default Publication