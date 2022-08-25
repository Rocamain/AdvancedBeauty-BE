const { Model } = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      this.hasMany(models.Booking, {
        foreignKey: 'customerId',
      });
    }
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

      email: {
        type: DataTypes.STRING,
        field: 'email',
        allowNull: false,
        validate: { isEmail: true },
      },

      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
        //  Not decided if i want to implement this.

        // get() {
        //   const rawValue = this.getDataValue('createdAt');
        //   return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
        // },
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
        //  Not decided if i want to implement this.

        // get() {
        //   const rawValue = this.getDataValue('updatedAt');
        //   return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
        // },
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
