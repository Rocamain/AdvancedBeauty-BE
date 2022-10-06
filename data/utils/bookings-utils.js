const { eachDayOfInterval, isSunday } = require('date-fns');

const checkOverlappedBookings = (bookingWithDate, previousBookings) => {
  return previousBookings.filter(
    (prevBooking, i) =>
      bookingWithDate.appointment < prevBooking.appointmentFinish &&
      bookingWithDate.appointmentFinish > prevBooking.appointment
  );
};

const sortByAppointment = (bookings) =>
  bookings.sort(
    (prevBooking, booking) => prevBooking.appointment - booking.appointment
  );

const yearDays = eachDayOfInterval({
  start: new Date(2022, 7, 19),
  end: new Date(2023, 7, 19),
});

const bankHolidays = [
  new Date(2023, 0, 1),
  new Date(2023, 0, 6),
  new Date(2023, 3, 15),
  new Date(2023, 3, 18),
  new Date(2023, 5, 6),
  new Date(2023, 5, 6),
  new Date(2023, 7, 15),
  new Date(2022, 8, 24),
];

const workingDays = yearDays.filter(
  (day) => !isSunday(day) && !bankHolidays.includes(bankHolidays)
);

module.exports = { checkOverlappedBookings, sortByAppointment, workingDays };
