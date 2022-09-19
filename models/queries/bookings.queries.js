const { Booking, Customer, Service, Shop } = require('../index');
const { fetchAllServices } = require('../queries/services.queries');
const { getAvailableBookings } = require('./utils/index');
const { addMinutes, addHours } = require('date-fns');

const { Op } = require('sequelize');

const fetchAllBookings = async ({
  customerName,
  email,
  serviceName,
  duration,
  type,
  shopName,
  appointment,
  appointmentFrom = new Date(1900, 0, 1),
  appointmentTo = Infinity,
  createdAt,
  createdFrom = new Date(1900, 0, 1),
  createdTo = Infinity,
  updatedAt,
  updatedFrom = new Date(1900, 0, 1),
  updatedTo = Infinity,
  limit = 20,
  offset = 0,
  order = 'ASC',
  orderBy = 'appointment',
  ...restOfQuery
}) => {
  const bookings = await Booking.findAll({
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
        attributes: ['id', 'serviceName', 'type', 'price', 'duration'],
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

  return bookings;
};

const fetchBookingsByShopAndDay = async ({
  shopName,
  appointmentFrom,
  appointmentTo,
  order = 'ASC',
  orderBy = 'appointment',
}) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        appointment: {
          [Op.between]: [new Date(appointmentFrom), new Date(appointmentTo)],
        },
      },
      attributes: ['id', 'appointment', 'time', 'appointmentFinish'],
      include: [
        {
          model: Shop,
          as: 'shopInfo',
          attributes: ['id', 'shopName'],
          where: { shopName: { [Op.iRegexp]: `^${shopName}$` } },
        },
      ],
      order: [[orderBy, order]],
    }).then((bookings) =>
      bookings.map(
        ({ id, appointment, time, appointmentFinish, shopInfo }) => ({
          id,
          appointment,
          time,
          appointmentFinish,
          shopName: shopInfo.shopName,
        })
      )
    );

    return bookings;
  } catch (err) {
    throw err;
  }
};

const postBooking = async ({
  serviceId,
  shopId,
  customerId,
  serviceTime,
  appointment,
}) => {
  if (shopId && serviceId && customerId && serviceTime) {
    const appointmentDate = new Date(appointment);
    const appointmentEnd = addMinutes(appointmentDate, serviceTime);
    const isAppointmentOverlapped = await fetchAllBookings({
      appointmentFrom: appointment,
      appointmentTo: appointmentEnd,
      shopId,
    }).then((bookings) => {
      const currentBooking = bookings[0];
      const currentBkngStartTime = currentBooking?.appointment;
      const currentBkngEndTime = currentBooking?.appointmentFinish;
      const isOverlapping =
        (appointment >= currentBkngStartTime &&
          appointment <= currentBkngEndTime) ||
        (appointmentEnd > currentBkngStartTime &&
          appointmentEnd <= currentBkngEndTime);

      if (isOverlapping) {
        const err = new Error();
        err.msg = 'Bad request: Appointment not available';
        err.status = 400;
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
        appointmentFinish: addMinutes(new Date(appointment), serviceTime),
      });

      return newBooking;
    }
  }
};

const fetchAvailableBookings = async ({ serviceName, shopName, date }) => {
  const appointmentFrom = date;
  const appointmentTo = addHours(date, 11);

  try {
    const [service] = await fetchAllServices({ serviceName });
    const { duration } = service.dataValues;

    const bookings = await fetchBookingsByShopAndDay({
      shopName,
      appointmentTo,
      appointmentFrom,
    });

    // Possible implementation for getting the closing/opening times of the shop
    // by make a query to db, below default

    let openingTime = appointmentFrom;
    let closingTime = appointmentTo;

    if (bookings) {
      const availableBookings = getAvailableBookings({
        openingTime,
        closingTime,
        bookings,
        serviceTime: duration,
      });

      return availableBookings;
    }
  } catch (err) {
    return err;
  }
};

module.exports = {
  fetchAllBookings,
  postBooking,
  fetchAvailableBookings,
};
