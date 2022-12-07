const fetchIntel = require('./utils/fetch-helpers');
console.log(process.env.NODE_ENV);
process.env.NODE_ENV !== 'test'
  ? fetchIntel({
      servicesLength: 22,
      bookingsLength: 2500,
      customersLength: 150,
    })
  : fetchIntel({ servicesLength: 10, bookingsLength: 15, customersLength: 15 });
