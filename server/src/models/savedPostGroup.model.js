import db from "../config/database.js";

const SavedPostGroup = db.define("SavedPostGroup", {
  id: {
    type: db.Sequelize.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    primaryKey: true,
  },
  groupName: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  createdBy: {
    type: db.Sequelize.UUID,
    allowNull: false,
  },
});

export default SavedPostGroup;
