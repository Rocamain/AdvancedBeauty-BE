const { sample } = require('lodash');
const {
  checkOverlappedBookings,
  sortByAppointment,
  workingDays,
} = require('./bookings-utils');
const { addHours, addMinutes } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const createBookings = (
  services,
  customers,
  bookingsLength,
  shopId,
  bookings = []
) => {
  if (bookingsLength <= 0) {
    return bookings;
  }

  const confirmedReservations = Array(bookingsLength)
    .fill()
    .concat(bookings)
    .reduce(
      (previousBookings, currentBooking, i) => {
        const { service_id, duration } = sample(services);
        const { customer_id } = sample(customers);

        const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        const randomHour = sample(hours);
        const date = sample(workingDays);
        const timeZoneAppointment = utcToZonedTime(date, 'Europe/Madrid');
        const appointment = addHours(timeZoneAppointment, randomHour);
        const appointment_finish = addMinutes(appointment, duration);

        const newBooking = {
          shop_id: shopId,
          service_id,
          customer_id,
          appointment,
          appointment_finish,
        };

        if (checkOverlappedBookings(newBooking, previousBookings).length > 0) {
          return [...previousBookings];
        }

        return sortByAppointment([...previousBookings, newBooking]);
      },

      []
    );

  const totalBookingsCompleted = confirmedReservations.length;

  return createBookings(
    services,
    customers,
    bookingsLength - totalBookingsCompleted,
    shopId,
    confirmedReservations
  );
};

module.exports = createBookings;
