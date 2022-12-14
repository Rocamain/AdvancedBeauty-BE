const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      this.hasMany(models.Booking, {
        foreignKey: 'service_id',
      });
    }
  }
  Service.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'service_id',
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      serviceName: {
        type: DataTypes.STRING,
        field: 'service_name',
        allowNull: false,
        unique: true,
        validate: {
          notIn: {
            args: [[false, true]],
            msg: 'Validation on serviceName cannot be Boolean',
          },
          len: {
            args: [4, 40],
            msg: 'Validation on serviceName min:4, max:20',
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Facial', 'Body', 'Manicure and pedicure', 'Laser']],
            msg: 'Invalid input on type, available options: Facial, Body, Manicure and pedicure or Laser',
          },
        },
      },
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
      tableName: 'services',
    }
  );
  return Service;
};
