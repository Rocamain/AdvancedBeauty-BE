const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customerInfo',
      });
      this.belongsTo(models.Service, {
        foreignKey: 'service_id',
        as: 'serviceInfo',
      });
      this.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        as: 'shopInfo',
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'booking_id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      shopId: { type: DataTypes.INTEGER, field: 'shop_id', allowNull: false },
      serviceId: {
        type: DataTypes.INTEGER,
        field: 'service_id',
        allowNull: false,
      },
      customerId: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        allowNull: false,
      },
      appointment: { type: DataTypes.DATE, allowNull: false },
      appointmentFinish: {
        type: DataTypes.DATE,
        field: 'appointment_finish',
        allowNull: false,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'bookings',
    }
  );
  return Booking;
};
