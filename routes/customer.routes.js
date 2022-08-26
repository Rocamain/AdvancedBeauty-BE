const { Router } = require('express');
const {
  getAllCustomers,
  createCustomer,
  eraseCustomer,
  getCustomer,
  updateCustomer,
} = require('../controllers/customer.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router
  .route('/customers')
  .get(withErrorHandling(getAllCustomers))
  .post(withErrorHandling(createCustomer));
router
  .route('/customers/:id')
  .get(withErrorHandling(getCustomer))
  .put(withErrorHandling(updateCustomer))
  .delete(withErrorHandling(eraseCustomer));

module.exports = router;
