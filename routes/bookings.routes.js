const { Router } = require('express');
const {
  getAllBookings,
  createBooking,
} = require('../controllers/bookings.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router
  .route('/bookings')
  .get(withErrorHandling(getAllBookings))
  .post(withErrorHandling(createBooking));

module.exports = router;
