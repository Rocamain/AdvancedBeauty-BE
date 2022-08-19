module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      shopId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },

      shopName: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shops');
  },
};
