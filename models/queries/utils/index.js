const { fetchAllShops } = require('../shops.queries.js');
const { fetchAllServices } = require('../services.queries');
const { findOrCreateCustomer } = require('../customers.queries');
const { set, getYear, getMonth, getDate, addMinutes } = require('date-fns');

const getServiceInfo = async ({ serviceName }) => {
  const service = await fetchAllServices({ serviceName }).then(([service]) => {
    if (service) {
      const serviceId = service.dataValues.id;
      const duration = service.dataValues.duration;

      return {
        serviceId,
        duration,
      };
    }

    const err = new Error();
    err.msg = 'Bad request: Service not exist';
    err.status = 400;

    throw err;
  });
  return service;
};

const getShopId = async ({ shopName }) => {
  try {
    const shop = await fetchAllShops({ shopName }).then((shop) => {
      if (shop.length === 0) {
        const err = new Error();
        err.msg = 'Bad request: Shop not exist';
        err.status = 400;

        throw err;
      }
      return {
        shopId: shop[0].dataValues.id,
      };
    });

    return shop;
  } catch (err) {
    throw err;
  }
};

const getCustomerId = async ({ customerName, email }) => {
  try {
    const customerId = await findOrCreateCustomer({
      customerName,
      email,
    }).then((customer) => {
      const errorMsg = customer?.errors && customer?.errors[0]?.message;

      if (errorMsg) {
        const err = new Error();

        if (errorMsg === 'email must be unique') {
          const err = new Error();
          err.msg = 'Bad request: Name value is not matching with the email';
          err.status = 400;
          throw err;
        }
        if (errorMsg === 'Validation len on customerName failed') {
          const err = new Error();
          err.msg = 'Bad request: CustomerName minimum length failed.';
          err.status = 400;
          throw err;
        }
        if (errorMsg === 'Validation isEmail on email failed') {
          const err = new Error();
          err.msg = 'Bad request: Email validation failed.';
          err.status = 400;
          throw err;
        }

        err.errors = [{ message: errorMsg }];

        throw err;
      }

      const customerId = customer.dataValues.id;

      return {
        customerId,
      };
    });

    return customerId;
  } catch (err) {
    throw err;
  }
};

const getIds = async ({ serviceName, shopName, customerName, email }) => {
  try {
    const { serviceId, duration } = await getServiceInfo({
      serviceName,
    });

    const { shopId } = await getShopId({ shopName });

    const { customerId } = await getCustomerId({ customerName, email });

    return {
      serviceId,
      shopId,
      customerId,
      serviceTime: duration,
    };
  } catch (err) {
    throw err;
  }
};

const getAvailableBookings = ({
  openingTime,
  closingTime,
  bookings,
  serviceTime,
  newBookingStartTime = openingTime,
  availableSpots = [],
}) => {
  let newBookingEndTime = addMinutes(
    new Date(newBookingStartTime),
    serviceTime
  );
  const currentBooking = bookings[0];
  const currentBkngStartTime = currentBooking?.appointment;
  const currentBkngEndTime = currentBooking?.appointmentFinish;

  const isOverlapping =
    currentBooking &&
    newBookingStartTime < currentBkngEndTime &&
    newBookingEndTime > currentBkngStartTime;

  // Exit

  if (bookings.length === 0) {
    //  if the new booking has end date lower or equal than closing time it will
    // execute the loop and new booking until the condition is true.

    for (
      newBookingEndTime;
      newBookingEndTime <= closingTime;
      newBookingEndTime = addMinutes(new Date(newBookingEndTime), serviceTime)
    ) {
      availableSpots.push(newBookingStartTime);
      newBookingStartTime = addMinutes(
        new Date(newBookingStartTime),
        serviceTime
      );
    }

    return availableSpots;
  }

  if (isOverlapping) {
    newBookingStartTime = currentBkngEndTime;
    bookings.shift();

    // recursion

    return getAvailableBookings({
      newBookingStartTime,
      closingTime,
      bookings,
      availableSpots,
      serviceTime,
    });
  }

  // if it is not overlapping and is not last booking then
  // the for loop executes and will check if the new bookings ends before or same time as
  // current booking start time, in that case place available booking

  for (
    newBookingEndTime;
    newBookingEndTime <= currentBkngStartTime;
    newBookingEndTime = addMinutes(new Date(newBookingEndTime), serviceTime)
  ) {
    availableSpots.push(newBookingStartTime);
    newBookingStartTime = addMinutes(
      new Date(newBookingStartTime),
      serviceTime
    );
  }

  newBookingStartTime = currentBkngEndTime;
  bookings.shift();

  // recursion

  return getAvailableBookings({
    newBookingStartTime,
    closingTime,
    bookings,
    availableSpots,
    serviceTime,
  });
};

const LOCATIONS = {
  3: 'es-b',
  1: 'es-ct',
  2: 'es-ct',
};

const throwShopClosedErr = async ({
  appointment,
  appointmentFinish,
  shopId,
}) => {
  const appointmentDate = new Date(appointment);

  const startLimit = set(appointmentDate, {
    hours: 9,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const startLimitWithOffSet = addMinutes(
    startLimit,
    startLimit.getTimezoneOffset() * -1
  );

  const endLimit = set(new Date(appointmentFinish), {
    hours: 20,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const endLimitWithOffSet = addMinutes(
    endLimit,
    endLimit.getTimezoneOffset() * -1
  );

  const isNotWithinOpeningTimes =
    appointment < startLimitWithOffSet ||
    appointmentFinish > endLimitWithOffSet;

  const year = getYear(appointmentDate);
  const month = getMonth(appointmentDate) + 1;
  const day = getDate(appointmentDate);

  try {
    const nationalHolsData = await fetch(
      `${process.env.HOLS_API}?&api_key=${process.env.HOLS_KEY}&country=es&type=national&year=${year}&month=${month}&day=${day}`
    );
    const localHolsData = await fetch(
      `${process.env.HOLS_API}?&api_key=${process.env.HOLS_KEY}&country=es&location=${LOCATIONS[shopId]}&type=national&year=${year}&month=${month}&day=${day}`
    );
    if (nationalHolsData) {
      const nationalHolsParsed = await nationalHolsData.json();
      const nationalHols = nationalHolsParsed.response.holidays;
      const localHolsParsed = await localHolsData.json();
      const localHols = localHolsParsed.response.holidays;
      const isHoliday = localHols.length > 0 || nationalHols.length > 0;

      if (isHoliday || isNotWithinOpeningTimes) {
        const err = new Error();
        err.msg = 'Bad request: Booking needs to be within the opening time';
        err.status = 400;
        throw err;
      }

      return;
    }
    return;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getIds,
  getAvailableBookings,
  getCustomerId,
  throwShopClosedErr,
};
