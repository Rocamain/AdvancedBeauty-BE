module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        field: 'booking_id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      shopId: {
        type: Sequelize.INTEGER,
        field: 'shop_id',
        allowNull: false,
        references: {
          model: 'shops',
          key: 'shop_id',
        },
      },
      serviceId: {
        type: Sequelize.INTEGER,
        field: 'service_id',
        allowNull: false,
        references: {
          model: 'services',
          key: 'service_id',
        },
      },
      customerId: {
        type: Sequelize.INTEGER,
        field: 'customer_id',
        allowNull: false,
        references: {
          model: 'customers',
          key: 'customer_id',
        },
      },
      appointment: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      appointmentFinish: {
        type: Sequelize.DATE,
        field: 'appointment_finish',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  },
};
