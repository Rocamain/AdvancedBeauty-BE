const { Service } = require('../index');
const { Op } = require('sequelize');

const fetchAllServices = ({
  orderBy = 'id',
  order = 'ASC',
  limit = 20,
  offset = 0,
  serviceName,
  ...queryFields
}) => {
  return Service.findAll({
    where: {
      ...queryFields,
      serviceName: {
        [Op.iRegexp]: serviceName ? `^${serviceName}$` : '[a-zA-Z]',
      },
    },
    limit,
    offset,
    order: [[orderBy, order]],
  });
};

module.exports = {
  fetchAllServices,
};
