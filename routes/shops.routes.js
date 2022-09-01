const { Router } = require('express');
const { getAllShops } = require('../controllers/shops.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router.route('/shops').get(withErrorHandling(getAllShops));

module.exports = router;
