const { Service } = require('../index');
const { Op } = require('sequelize');

const fetchAllServices = ({
  orderBy = 'id',
  order = 'ASC',
  limit = 20,
  offset = 0,
  serviceName,
  type,
  createdAt,
  createdFrom = new Date(1900, 0, 1),
  createdTo = new Date(Date.now()),
  updatedAt,
  updatedFrom = new Date(1900, 0, 1),
  updatedTo = new Date(Date.now()),
  ...queryFields
}) => {
  return Service.findAll({
    where: {
      ...queryFields,
      serviceName: {
        [Op.iRegexp]: serviceName ? `^${serviceName}$` : '[a-zA-Z]',
      },
      type: {
        [Op.iRegexp]: type ? `^${type}$` : '[a-zA-Z]',
      },
      createdAt: {
        [Op.between]: [
          createdAt ? createdAt : createdFrom,
          createdAt ? createdAt : createdTo,
        ],
      },
      updatedAt: {
        [Op.between]: [
          updatedAt ? updatedAt : updatedFrom,
          updatedAt ? updatedAt : updatedTo,
        ],
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
