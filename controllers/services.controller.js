const { fetchAllServices } = require('../models/queries/services.queries');
const { checkIsNum } = require('./utils/index');

const getAllServices = (req, res, next) => {
  const { query } = req;

  fetchAllServices(query)
    .then((services) => res.status(200).json({ services }))
    .catch(next);
};

module.exports = {
  getAllServices,
};
