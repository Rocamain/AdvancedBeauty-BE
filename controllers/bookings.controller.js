const {
  fetchAllBookings,
  postBooking,
  fetchAvailableBookings,
} = require('../models/queries/bookings.queries');
const sendEmail = require('../services/send_grid');
const { getIds } = require('../models/queries/utils/index');
const { set, isPast } = require('date-fns');
const { checkFields, checkIsNum } = require('./utils');

//
//

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

  const { hasAllFields, errors } = checkFields(queryFields, requiredFields);
  const { isNum, numErrors } = checkIsNum([{ customerName }, { appointment }]);
  const isPastAppointment = isPast(appointment);

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
    .then(({ serviceId, shopId, customerId, serviceTime }) => {
      return postBooking({
        serviceId,
        shopId,
        customerId,
        serviceTime,
        appointment,
      }).then((booking) => {
        res.status(201).json({ booking });
        sendEmail({
          email,
          appointment: booking.appointment,
          time: booking.time,
          serviceName,
        });
      });
    })
    .catch(next);
};

const getAvailableBookings = (req, res, next) => {
  const { date, serviceName, shopName } = req.query;

  const queryFields = Object.keys(req.query);

  const requiredFields = ['serviceName', 'shopName', 'date'];

  const { hasAllFields, errors } = checkFields(queryFields, requiredFields);

  if (!hasAllFields) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: missing field: ${errors[0]}`;
    throw err;
  }

  const appointment = date.split('/', 3);
  const [day, month, year] = appointment;
  const resetDate = set(new Date(), { year, month, date: day });

  fetchAvailableBookings({ date: resetDate, serviceName, shopName })
    .then((bookings) => res.status(200).json({ bookings }))
    .catch(next);
};

module.exports = {
  getAvailableBookings,
  getAllBookings,
  createBooking,
};
