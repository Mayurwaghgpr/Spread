'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'displayName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
 // Update existing records if necessary, setting displayName to username
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "displayName" = "username"
      WHERE "displayName" IS '';
    `);
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'displayName');
  }
};
