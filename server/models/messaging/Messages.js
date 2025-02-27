import { DataTypes } from 'sequelize';
import Database from '../../utils/database.js';

const Messages = Database.define('Messages', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull:false
    },
    conversationId: {
        type: DataTypes.UUID,
        require:true
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,       
        require:true
    },
    replyedTo: {
        type: DataTypes.UUID,
    },
   
})

export default Messages