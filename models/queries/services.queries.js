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

const postService = async ({ serviceName, price, duration, type }) => {
  try {
    const service = await Service.create({
      serviceName,
      price,
      duration,
      type,
    });

    return service;
  } catch (err) {
    throw err;
  }
};

const getServiceByPK = async ({ id }) => {
  try {
    const service = await Service.findByPk(id);
    if (service) {
      return service;
    }
    return null;
  } catch (err) {
    throw err;
  }
};
const deleteService = async ({ id }) => {
  try {
    await Service.destroy({ where: { id: id } });
  } catch (err) {
    throw err;
  }
};

const putService = async ({
  id,
  serviceName,
  type,
  price,
  status,
  duration,
}) => {
  try {
    const service = await Service.findByPk(id);

    if (service) {
      await service.update({ serviceName, type, price, status, duration });
      await service.save();
      return service;
    }
    return null;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  fetchAllServices,
  postService,
  getServiceByPK,
  deleteService,
  putService,
};
