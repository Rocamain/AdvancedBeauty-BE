const { Router } = require('express');
const {
  getAllServices,
  createService,
  getService,
  eraseService,
  updateService,
} = require('../controllers/services.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router
  .route('/services')
  .get(withErrorHandling(getAllServices))
  .post(withErrorHandling(createService));

router
  .route('/services/:id')
  .get(withErrorHandling(getService))
  .delete(withErrorHandling(eraseService))
  .put(withErrorHandling(updateService));

module.exports = router;
