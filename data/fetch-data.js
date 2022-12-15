const fetchIntel = require('./utils/fetch-helpers');

process.env.NODE_ENV !== 'test'
  ? fetchIntel({
      servicesLength: 22,
      bookingsLength: 1500,
      customersLength: 150,
    })
  : fetchIntel({ servicesLength: 10, bookingsLength: 2, customersLength: 15 });
