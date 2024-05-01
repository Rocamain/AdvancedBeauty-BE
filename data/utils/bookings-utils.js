const { eachDayOfInterval, isSunday, addDays, set } = require('date-fns');

const checkOverlappedBookings = (bookingWithDate, previousBookings) => {
  return previousBookings.filter(
    (prevBooking, i) =>
      (bookingWithDate.appointment <= prevBooking.appointment &&
        bookingWithDate.appointmentFinish > prevBooking.appointment) ||
      (bookingWithDate.appointment < prevBooking.appointmentFinish &&
        bookingWithDate.appointmentFinish >= prevBooking.appointmentFinish) ||
      (bookingWithDate.appointment >= prevBooking.appointment &&
        bookingWithDate.appointmentFinish <= prevBooking.appointmentFinish) ||
      (bookingWithDate.appointment < prevBooking.appointment &&
        bookingWithDate.appointmentFinish > prevBooking.appointmentFinish)
  );
};

const sortByAppointment = (bookings) =>
  bookings.sort(
    (prevBooking, booking) => prevBooking.appointment - booking.appointment
  );
const TOMORROW = addDays(
  set(new Date(), { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
  1
);
const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = new Date().getFullYear();
const LAST_DAY = addDays(TOMORROW, 365);

const YEARS_INTERVAL = eachDayOfInterval({
  start: TOMORROW,
  end: LAST_DAY,
});

const bankHolidays = [
  new Date(CURRENT_YEAR, 0, 1),
  new Date(CURRENT_YEAR, 0, 6),
  new Date(CURRENT_YEAR, 3, 15),
  new Date(CURRENT_YEAR, 3, 18),
  new Date(CURRENT_YEAR, 5, 6),
  new Date(CURRENT_YEAR, 5, 6),
  new Date(CURRENT_YEAR, 7, 15),
  new Date(CURRENT_YEAR, 8, 24),
  new Date(CURRENT_YEAR, 12, 25),
  new Date(CURRENT_YEAR, 12, 6),
  new Date(NEXT_YEAR, 0, 1),
  new Date(NEXT_YEAR, 0, 6),
  new Date(NEXT_YEAR, 3, 15),
  new Date(NEXT_YEAR, 3, 18),
  new Date(NEXT_YEAR, 5, 6),
  new Date(NEXT_YEAR, 5, 6),
  new Date(NEXT_YEAR, 7, 15),
  new Date(NEXT_YEAR, 8, 24),
  new Date(NEXT_YEAR, 12, 25),
  new Date(NEXT_YEAR, 12, 6),
];

const workingDays = YEARS_INTERVAL.filter(
  (day) => !isSunday(day) && !bankHolidays.includes(bankHolidays)
);

module.exports = { checkOverlappedBookings, sortByAppointment, workingDays };
