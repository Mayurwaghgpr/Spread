import { DataTypes } from 'sequelize';

import Database from '../db/database.js';


const Archive = Database.define('Archive', {
   postId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
   userId: {
        type: DataTypes.UUID,
        allowNull:false
    }
}, {
    indexes: [
        // Composite index on postId and userId
        {
            name: 'postId_userId_index', 
            fields: ['postId', 'userId'],
            unique: true,
        },
        {
            name: 'userId_index', 
            fields: ['userId'],
        },

        {
            name: 'postId_index', 
            fields: ['postId'],
        }
    ]
})

export default Archive