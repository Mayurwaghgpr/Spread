import { DataTypes } from 'sequelize';

import Database from '../utils/database.js';


const Archive = Database.define('Archive', {
   postId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   userId: {
        type: DataTypes.UUID,
        allowNull:false
    }
})

export default Archive