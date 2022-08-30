const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      this.hasMany(models.Booking, {
        foreignKey: 'customer_id',
      });
    }
  }
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'customer_id',
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      customerName: {
        type: DataTypes.STRING,
        field: 'customer_name',
        allowNull: false,
        validate: { len: [4, 30] },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
