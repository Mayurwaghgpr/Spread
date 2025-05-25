import { DataTypes } from "sequelize";
import Database from "../../utils/database.js";

const PublicationMembers = Database.define("publication_members", {
  memberId: {
        type: DataTypes.UUID,
      allowNull:false
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