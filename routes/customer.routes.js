const { Router } = require('express');
const {
  getAllCustomers,
  createCustomer,
  getCustomerByPK,
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
  .get(withErrorHandling(getCustomerByPK))
  .put(withErrorHandling(updateCustomer));

module.exports = router;
