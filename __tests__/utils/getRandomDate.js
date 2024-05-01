const add = require('date-fns/add');
const set = require('date-fns/set');

module.exports = () => {
  const randomDay = Math.floor(Math.random() * 365);

  // Generate a ramdon numbe bbettween 9 to 19
  const randomHour = Math.floor(Math.random() * 11) + 9;

  // Set to the time to todays date.
  const date = set(new Date(), {
    hours: randomHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  // Add some random days to todays day
  const randomDate = add(date, { days: randomDay });

  return randomDate;
};
