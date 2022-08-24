const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {}
  }
  Service.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'service_id',
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      serviceName: {
        type: DataTypes.INTEGER,
        field: 'service_name',
        allowNull: false,
        unique: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.BOOLEAN },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Service',
      tableName: 'Services',
    }
  );
  return Service;
};
