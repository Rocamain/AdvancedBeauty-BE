const { fetchAllShops } = require('../models/queries/shops.queries');
const { checkIsNum } = require('./utils/index');

const getAllShops = (req, res, next) => {
  const { query } = req;

  fetchAllShops(query)
    .then((shops) => res.status(200).json({ shops }))
    .catch(next);
};

module.exports = {
  getAllShops,
};
