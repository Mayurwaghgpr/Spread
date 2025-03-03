import { DataTypes } from 'sequelize';
import Database from '../../utils/database.js';


const Members = Database.define('Members', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },

    memberType: {
        type: DataTypes.ENUM('admin', 'user'),
        default:'user'
    },
    memberId: {
        type: DataTypes.UUID,
        allowNull:false,
    },
    conversationId: {
        type: DataTypes.UUID,
        require:true
    }
       
})

export default Members