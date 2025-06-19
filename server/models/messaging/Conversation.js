import { DataTypes } from 'sequelize';
import Database from '../../db/database.js';

const Conversation = Database.define('Conversation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    conversationType: {
        type: DataTypes.ENUM('private', 'group'),
        default:"private"
    },
    lastMessage: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    groupName: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue:'https://res.cloudinary.com/dvjs0twtc/image/upload/v1740680568/groupOutlook_prbzc3.png',
    },
    discription: {
        type: DataTypes.STRING,
        default:'',
    }

})


export default Conversation;