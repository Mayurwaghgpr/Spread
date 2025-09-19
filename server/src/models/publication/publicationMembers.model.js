import { DataTypes } from "sequelize";
import db from "../../config/database.js";

const PublicationMembers = db.define("publication_members", {
  memberId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  publicationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "author", "editor"),
  },
});

export default PublicationMembers;
