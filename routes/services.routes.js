const { Router } = require('express');
const { getAllServices } = require('../controllers/services.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router.route('/services').get(withErrorHandling(getAllServices));

module.exports = router;
