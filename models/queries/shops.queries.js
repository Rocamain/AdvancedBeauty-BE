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

module.exports = {
  fetchAllShops,
};
