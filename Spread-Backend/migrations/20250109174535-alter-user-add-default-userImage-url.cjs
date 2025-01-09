'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userImage', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'https://res.cloudinary.com/dvjs0twtc/image/upload/zjhgm5fjuyz1rcp3ahqz', // New URL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'userImage', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'images/placeholderImages/ProfOutlook.png', // Revert to the previous default URL
    });
  }
};
