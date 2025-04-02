import { DataTypes } from "sequelize";
import Database from "../utils/database";


const Notify = Database.define("Notification", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM(['like',"comment","follow","mention","message","repost","tag","system"]),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    read:{
        type: DataTypes.BOOLEAN,
        default:false
    },
    sendTo: {
        type: DataTypes.UUID,
    },
    userId: {
        type: DataTypes.UUID,
    },

})

export default Notify;