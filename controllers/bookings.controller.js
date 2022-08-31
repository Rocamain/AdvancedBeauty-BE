const { fetchAllBookings } = require('../models/queries/bookings.queries');

const getAllBookings = (req, res, next) => {
  const { query } = req;

  fetchAllBookings(query)
    .then((bookings) => res.status(200).json({ bookings }))
    .catch(next);
};

module.exports = {
  getAllBookings,
};
