const { Router } = require('express');
const {
  getAllServices,
  createService,
  getService,
  eraseService,
  updateService,
} = require('../controllers/services.controller');
const { withErrorHandling, methodNotAllowed } = require('../middlewares/index');
const router = Router();

router
  .route('/')
  .get(withErrorHandling(getAllServices))
  .post(withErrorHandling(createService))
  .all(methodNotAllowed);

router
  .route('/:id')
  .get(withErrorHandling(getService))
  .delete(withErrorHandling(eraseService))
  .put(withErrorHandling(updateService))
  .all(methodNotAllowed);

module.exports = router;
