const { Router } = require('express');
const {
  getAllShops,
  getShop,
  updateShop,
} = require('../controllers/shops.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router.route('/shops').get(withErrorHandling(getAllShops));

router
  .route('/shops/:id')
  .get(withErrorHandling(getShop))
  .put(withErrorHandling(updateShop));

module.exports = router;
