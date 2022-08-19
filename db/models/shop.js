const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {}
  }
  Shop.init(
    {
      shopId: DataTypes.INTEGER,
      shopName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Shop',
    }
  );
  return Shop;
};
