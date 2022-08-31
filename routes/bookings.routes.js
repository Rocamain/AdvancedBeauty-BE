const { Router } = require('express');
const { getAllBookings } = require('../controllers/bookings.controller');

const router = Router();

router.route('/bookings').get(getAllBookings);

module.exports = router;
