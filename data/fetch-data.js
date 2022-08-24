const fetchIntel = require('./utils/fetch-helpers');

process.env.NODE_ENV === 'development'
  ? fetchIntel({ servicesLength: 15, bookingsLength: 700 })
  : fetchIntel({ servicesLength: 10, bookingsLength: 15 });
