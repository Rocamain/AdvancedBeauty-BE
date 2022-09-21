const {
  fetchAllBookings,
  postBooking,
  fetchAvailableBookings,
  putBookingByPK,
  getBookingByID,
  deleteBooking,
} = require('../models/queries/bookings.queries');
const sendEmail = require('../services/send_grid');
const { getIds, getCustomerId } = require('../models/queries/utils/index');
const { set } = require('date-fns');
const { checkFields } = require('./utils');

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

  if (!hasAllFields) {
    const err = new Error();
    err.status = 400;
    err.msg = `Bad request: missing field: ${errors[0]}`;
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

  const resetDate = set(new Date(), {
    year,
    month: month - 1,
    date: day,
    hours: 9,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const isInvalidDate = resetDate.toString() === 'Invalid Date';

  if (isInvalidDate) {
    const err = new Error();
    err.status = 400;
    err.msg = 'Bad request: Invalid Date';
    throw err;
  }
  fetchAvailableBookings({ date: resetDate, serviceName, shopName })
    .then((bookings) => res.status(200).json({ bookings }))
    .catch(next);
};

const modifyBooking = (req, res, next) => {
  const { id } = req.params;
  const { appointment, customerName, email } = req.body;

  if (customerName && email) {
    getCustomerId({ customerName, email })
      .then(({ customerId }) =>
        putBookingByPK({
          id,
          customerId,
          appointment: new Date(appointment),
        })
          .then((booking) => {
            return res.status(203).json({ booking });
          })
          .catch(next)
      )
      .catch(next);
  }
};

const getBooking = (req, res, next) => {
  getBookingByID(req.params)
    .then((booking) => {
      res.status(200).json({ booking });
    })
    .catch(next);
};

const eraseBooking = (req, res, next) => {
  deleteBooking(req.params)
    .then((booking) => res.status(204).json({ booking }))
    .catch(next);
};

module.exports = {
  getAvailableBookings,
  modifyBooking,
  getAllBookings,
  createBooking,
  getBooking,
  eraseBooking,
};
