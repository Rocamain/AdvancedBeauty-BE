const {
  Booking,
  Customer,
  Service,
  Shop,
  sequelize,
} = require('../models/index');
const { fetchAllServices } = require('../services/services.services');
const { fetchAllShops } = require('../services/shops.services');
const { getAvailableBookings } = require('./utils/index');
const {
  addMinutes,
  addHours,
  getHours,
  getMinutes,
  parseISO,
} = require('date-fns');

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
  shopId,
  appointmentFrom,
  appointmentTo,
  order = 'ASC',
  orderBy = 'appointment',
}) => {
  try {
    const bookings = await Booking.findAll({
      where: {
        appointment: {
          [Op.between]: [appointmentFrom, appointmentTo],
        },
        shopId: shopId,
      },
      attributes: ['id', 'appointment', 'time', 'appointmentFinish'],
      order: [[orderBy, order]],
    }).then((bookings) => {
      return bookings.map(({ id, appointment, time, appointmentFinish }) => ({
        id,
        appointment,
        time,
        appointmentFinish,
      }));
    });

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
    const appointmentParsed = parseISO(appointment);
    const appointmentEnd = addMinutes(appointmentParsed, serviceTime);

    const isAppointmentOverlapped = await fetchAllBookings({
      appointmentFrom: appointmentParsed,
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
        appointment: appointmentParsed,
        appointmentFinish: addMinutes(appointmentParsed, serviceTime),
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
    const [shop] = await fetchAllShops({ shopName });

    if (!shop) {
      const err = new Error();
      err.msg = 'Bad request: shop does not exist';
      throw err;
    }
    if (!service) {
      const err = new Error();
      err.msg = 'Bad request: service does not exist';
      throw err;
    }

    const { duration } = service.dataValues;

    const bookings = await fetchBookingsByShopAndDay({
      shopId: shop.id,
      appointmentTo,
      appointmentFrom,
    });

    // Possible implementation for getting the closing/opening times of the shop
    // by make a query to db, below default

    let openingTime = appointmentFrom;
    let closingTime = appointmentTo;

    if (bookings && duration && shop) {
      const availableBookings = getAvailableBookings({
        openingTime,
        closingTime,
        bookings,
        serviceTime: duration,
      });

      const availableTimes = availableBookings.map((bookingDateAvailable) => {
        const hours = `${getHours(bookingDateAvailable)}`;
        let minutes = `${getMinutes(bookingDateAvailable)}`;

        minutes = minutes.length === 1 ? 0 + minutes : minutes;

        return `${hours}:${minutes}`;
      });
      return { availableBookings, availableTimes };
    }
  } catch (err) {
    err.status = 400;
    throw err;
  }
};

const getBookingByID = async ({ id }) => {
  try {
    const [booking] = await sequelize.query(
      `SELECT b.booking_id as id , c.customer_name , c.email, sh.shop_name , s.service_name, b.appointment, b.appointment_finish , b.created_at, b.updated_at FROM bookings AS b JOIN customers as c ON b.customer_id = c.customer_id JOIN services as s ON b.service_id = s.service_id JOIN shops as sh ON b.shop_id = sh.shop_id WHERE b.booking_id=${id} ORDER BY b.appointment DESC`
    );

    const bookingExist = booking[0];

    if (bookingExist) {
      const {
        id,
        customer_name,
        email,
        shop_name,
        appointment,
        appointment_finish,
        created_at,
        updated_at,
      } = booking[0];

      const cleanBooking = {
        id,
        customerName: customer_name,
        email,
        shopName: shop_name,
        appointment,
        appointmentFinish: appointment_finish,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return cleanBooking;
    }
    return [];
  } catch (err) {
    throw err;
  }
};

const deleteBooking = async ({ id }) => {
  try {
    await Booking.destroy({ where: { id: id } });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  fetchAllBookings,
  postBooking,
  fetchAvailableBookings,
  getBookingByID,
  deleteBooking,
};
