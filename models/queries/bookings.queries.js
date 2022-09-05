const { Booking, Customer, Service, Shop } = require('../index');
const { addMinutes } = require('date-fns');
const { getIds } = require('./utils/index');
const { Op } = require('sequelize');

const fetchAllBookings = ({
  customerName,
  email,
  serviceName,
  duration,
  type,
  shopName,
  appointment,
  appointmentFrom = new Date(1900, 0, 1),
  appointmentTo = new Date(Date.now()),
  createdAt,
  createdFrom = new Date(1900, 0, 1),
  createdTo = new Date(Date.now()),
  updatedAt,
  updatedFrom = new Date(1900, 0, 1),
  updatedTo = new Date(Date.now()),
  limit = 20,
  offset = 0,
  order = 'DESC',
  orderBy = 'id',
  ...restOfQuery
}) => {
  return Booking.findAll({
    where: {
      ...restOfQuery,
      appointment: {
        [Op.between]: [
          appointment ? appointment : appointmentFrom,
          appointment ? appointment : appointmentTo,
        ],
      },
      createdAt: {
        [Op.between]: [
          createdAt ? createdAt : createdFrom,
          createdAt ? createdAt : createdTo,
        ],
      },
      updatedAt: {
        [Op.between]: [
          updatedAt ? updatedAt : updatedFrom,
          updatedAt ? updatedAt : updatedTo,
        ],
      },
    },
    attributes: [
      'id',
      'appointment',
      'time',
      'appointmentFinish',
      'createdAt',
      'updatedAt',
    ],

    include: [
      {
        model: Customer,
        as: 'customerInfo',
        attributes: ['id', 'customerName', 'email'],
        required: true,
        where: {
          customer_name: {
            [Op.iRegexp]: customerName ? `${customerName}` : '^[a-zA-Z]',
          },
          email: {
            [Op.regexp]: email ? `/${email}/i` : '^[a-zA-Z0-9]',
          },
        },
      },
      {
        model: Service,
        as: 'serviceInfo',
        attributes: ['id', 'serviceName', 'type', 'duration'],
        where: [
          {
            service_name:
              typeof serviceName === 'undefined'
                ? { [Op.ne]: 'undefined' }
                : serviceName,
          },
          {
            type: typeof type === 'undefined' ? { [Op.ne]: 'undefined' } : type,
          },
          {
            duration:
              typeof duration === 'undefined' ? { [Op.ne]: 0 } : duration,
          },
        ],
      },
      {
        model: Shop,
        as: 'shopInfo',
        attributes: ['id', 'shopName'],
        where: {
          shopName:
            typeof shopName === 'undefined'
              ? {
                  [Op.ne]: 'undefined',
                }
              : shopName,
        },
      },
    ],
    offset: offset,
    limit: limit,

    order: [[orderBy, order]],
  });
};

const postBooking = async ({
  serviceId,
  shopId,
  customerId,
  duration,
  appointment,
}) => {
  if (shopId && serviceId && customerId && duration) {
    const isAppointmentOverlapped = await fetchAllBookings({
      appointmentTo: addMinutes(new Date(appointment), +duration),
      appointmentFrom: addMinutes(new Date(appointment), -duration),
      shopId: shopId,
    }).then((bookings) => {
      const err = new Error();
      err.msg = 'Bad request: Appointment not available';
      err.status = 400;

      if (Boolean(bookings.length)) {
        throw err;
      }
      return false;
    });

    if (!isAppointmentOverlapped) {
      const newBooking = await Booking.create({
        serviceId,
        shopId,
        customerId,
        appointment,
        appointmentFinish: addMinutes(new Date(appointment), duration),
      });

      return newBooking;
    }
  }
};

module.exports = {
  fetchAllBookings,
  postBooking,
};
