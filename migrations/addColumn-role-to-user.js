'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'role', {
      type: Sequelize.ENUM('Admin', 'Employee'),
      allowNull: false,
      defaultValue: 'Employee'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'role');
    // For PostgreSQL, you might need to drop the ENUM type itself if it was created separately.
    // However, if the type is implicitly created by addColumn with ENUM, 
    // dropping the column often handles the type removal or it might need specific raw SQL.
    // For now, we will just remove the column. If issues arise, we can add:
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_role";');
  }
}; 