const { Router } = require('express');
const {
  getAllCustomers,
  createCustomer,
  eraseCustomer,
  getCustomer,
  updateCustomer,
} = require('../controllers/customers.controller');
const { withErrorHandling, methodNotAllowed } = require('../middlewares/index');
const router = Router();

router
  .route('/')
  .get(withErrorHandling(getAllCustomers))
  .post(withErrorHandling(createCustomer))
  .all(methodNotAllowed);
router
  .route('/:id')
  .get(withErrorHandling(getCustomer))
  .put(withErrorHandling(updateCustomer))
  .delete(withErrorHandling(eraseCustomer))
  .all(methodNotAllowed);

module.exports = router;
