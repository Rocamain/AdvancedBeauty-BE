const {
  fetchAllShops,
  getShopByPK,
  putShop,
} = require('../models/queries/shops.queries');

const getAllShops = (req, res, next) => {
  const { query } = req;

  fetchAllShops(query)
    .then((shops) => res.status(200).json({ shops }))
    .catch(next);
};

const getShop = (req, res, next) => {
  getShopByPK(req.params)
    .then((shop) => {
      res.status(200).json({ shop });
    })
    .catch(next);
};

const updateShop = (req, res, next) => {
  const { id } = req.params;
  const { shopName, city, street, postcode, phone, mobile } = req.body;

  putShop({ shopName, city, street, postcode, phone, mobile, id })
    .then((shop) => {
      return res.status(203).json({ shop });
    })
    .catch(next);
};

module.exports = {
  getAllShops,
  getShop,
  updateShop,
};
