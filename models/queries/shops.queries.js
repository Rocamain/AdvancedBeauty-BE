const { Shop } = require('../index');
const { Op } = require('sequelize');
const fetchAllShops = ({
  orderBy = 'id',
  order = 'ASC',
  limit = 20,
  offset = 0,
  shopName,
  ...queryFields
}) => {
  return Shop.findAll({
    where: {
      shopName: {
        [Op.iRegexp]: shopName ? `^${shopName}$` : '[a-zA-Z]',
      },
      ...queryFields,
    },
    limit,
    offset,
    order: [[orderBy, order]],
  });
};

const getShopByPK = async ({ id }) => {
  try {
    const shop = await Shop.findByPk(id);
    if (shop) {
      return shop;
    }
    return null;
  } catch (err) {
    throw err;
  }
};
const putShop = async ({
  shopName,
  city,
  street,
  postcode,
  phone,
  mobile,
  id,
}) => {
  try {
    const shop = await Shop.findByPk(id);

    if (shop) {
      await shop.update({
        shopName,
        city,
        street,
        postcode,
        phone,
        mobile,
        id,
      });
      const updatedShop = await shop.save();

      return updatedShop;
    }
    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  fetchAllShops,
  getShopByPK,
  putShop,
};
