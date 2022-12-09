const { Router } = require('express');
const {
  getAllShops,
  getShop,
  updateShop,
} = require('../controllers/shops.controller');
const { withErrorHandling, methodNotAllowed } = require('../middlewares/index');
const router = Router();

router.route('/').get(withErrorHandling(getAllShops)).all(methodNotAllowed);

router
  .route('/:id')
  .get(withErrorHandling(getShop))
  .put(withErrorHandling(updateShop))
  .all(methodNotAllowed);

module.exports = router;
