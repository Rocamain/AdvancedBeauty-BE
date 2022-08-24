const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    findAll;
    static associate(models) {}
  }
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        primaryKey: true,
        autoIncrement: true,
      },
      customerName: {
        type: DataTypes.STRING,
        field: 'customer_name',
        allowNull: false,
      },
      email: { type: DataTypes.STRING, field: 'email', allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },

    {
      sequelize,
      tableName: 'customers',
      modelName: 'Customer',
    }
  );
  return Customer;
};
