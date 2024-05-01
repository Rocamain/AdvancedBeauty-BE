const { Router } = require('express');
const {
  getAllBookings,
  createBooking,
  getAvailableBookings,
  getBooking,
  eraseBooking,
} = require('../controllers/bookings.controller');
const { withErrorHandling, methodNotAllowed } = require('../middlewares/index');

const router = Router();

router
  .route('/')
  .get(withErrorHandling(getAllBookings))
  .post(withErrorHandling(createBooking))
  .all(methodNotAllowed);

router.route('/available').get(withErrorHandling(getAvailableBookings));

router
  .route('/:id')
  .get(withErrorHandling(getBooking))
  .delete(withErrorHandling(eraseBooking))
  .all(methodNotAllowed);

module.exports = router;
