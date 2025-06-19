import { DataTypes } from 'sequelize';
import Database from '../../db/database.js';

const Attachments = Database.define('Attachments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    AttachmentType: {
        type: DataTypes.ENUM(['audio', 'video', 'file']),
    },
    attachmentUrl: {
        type: DataTypes.STRING,
        default:''
    },
     messageId: {
        type: DataTypes.UUID,
        allowNull: false,       
        require:true
    },
    conversationId: {
        type: DataTypes.UUID,
        require:true
    },
})

export default  Attachments;