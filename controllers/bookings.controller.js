const {
  fetchAllBookings,
  postBooking,
} = require('../models/queries/bookings.queries');

const { getIds } = require('../models/queries/utils/index');

const {
  checkBodyFields,
  checkIsNum,
  checkIsPastAppointment,
} = require('./utils');

const getAllBookings = (req, res, next) => {
  const { query } = req;

  fetchAllBookings(query)
    .then((bookings) => res.status(200).json({ bookings }))
    .catch(next);
};

const createBooking = (req, res, next) => {
  const queryFields = Object.keys(req.body);

  const requiredFields = [
    'customerName',
    'email',
    'serviceName',
    'shopName',
    'appointment',
  ];
  const { serviceName, customerName, shopName, email, appointment } = req.body;

  const { hasAllFields, errors } = checkBodyFields(queryFields, requiredFields);
  const { isNum, numErrors } = checkIsNum([{ customerName }, { appointment }]);
  const isPastAppointment = checkIsPastAppointment(appointment);

  if (!hasAllFields) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: missing field: ${errors[0]}`;
    throw err;
  }

  if (isNum) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: ${numErrors[0]} cannot be a number`;
    throw err;
  }

  if (isPastAppointment) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: cannot book a date in the past`;
    throw err;
  }

  getIds({
    serviceName,
    customerName,
    shopName,
    email,
  })
    .then((ids) =>
      postBooking({ ...ids, appointment }).then((booking) => {
        res.status(201).json({ booking });
      })
    )
    .catch(next);
};

module.exports = {
  getAllBookings,
  createBooking,
};
