const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {}
  }
  Service.init(
    {
      serviceId: DataTypes.INTEGER,
      serviceName: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      type: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Service',
    }
  );
  return Service;
};
