const fetchIntel = require('./utils/fetch-helpers');

console.log(
  process.env.NODE_ENV === 'development',
  '-------------------->',
  process.env.NODE_ENV
);

process.env === 'development'
  ? fetchIntel({ servicesLength: 15, bookingsLength: 700 })
  : fetchIntel({ servicesLength: 10, bookingsLength: 15 });
