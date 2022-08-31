const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      this.hasMany(models.Booking, {
        foreignKey: 'shop_id',
      });
    }
  }

  Shop.init(
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'shop_id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      shopName: {
        type: DataTypes.INTEGER,
        field: 'shop_name',
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: 'Shop',
      tableName: 'shops',
    }
  );
  return Shop;
};
