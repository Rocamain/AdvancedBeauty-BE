const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {}
  }
  Booking.init(
    {
      bookingId: DataTypes.STRING,
      shopId: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      appointment: DataTypes.STRING,
      appointmentFinish: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );
  return Booking;
};
