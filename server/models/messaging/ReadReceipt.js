import { DataTypes } from 'sequelize';
import Database from '../../db/database.js';


const   ReadReceipt = Database.define('ReadReceipt', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
     status: {
        type: DataTypes.ENUM(['Pending', 'Sent', 'Received', 'Seen']),
        default:'Pending'
    },
    messageId: {
        type: DataTypes.UUID,
        allowNull: false,       
        require:true
     },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,       
        require:true
     }
})

export default ReadReceipt; 