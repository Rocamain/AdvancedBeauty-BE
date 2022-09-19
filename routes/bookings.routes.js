const { Router } = require('express');
const {
  getAllBookings,
  createBooking,
  getAvailableBookings,
  modifyBooking,
} = require('../controllers/bookings.controller');
const { withErrorHandling } = require('../middlewares/index');
const router = Router();

router
  .route('/bookings')
  .get(withErrorHandling(getAllBookings))
  .post(withErrorHandling(createBooking));
router.route('/bookings/:id').put(withErrorHandling(modifyBooking));

router
  .route('/bookings/available')
  .get(withErrorHandling(getAvailableBookings));

module.exports = router;
