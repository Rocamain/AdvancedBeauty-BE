const { Router } = require('express');
const {
  getAllBookings,
  createBooking,
  getAvailableBookings,
  modifyBooking,
  getBooking,
  eraseBooking,
} = require('../controllers/bookings.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router
  .route('/bookings')
  .get(withErrorHandling(getAllBookings))
  .post(withErrorHandling(createBooking));

router
  .route('/bookings/available')
  .get(withErrorHandling(getAvailableBookings));

router
  .route('/bookings/:id')
  .get(withErrorHandling(getBooking))
  .put(withErrorHandling(modifyBooking))
  .delete(withErrorHandling(eraseBooking));

module.exports = router;
