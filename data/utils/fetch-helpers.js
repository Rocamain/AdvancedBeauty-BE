const createCustomers = require('./createCustomers');
const createServices = require('./createServices');
const createBookings = require('./createBookings');
const shops = require('./shops');
const { promisify } = require('util');
const fs = require('fs');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const generateFileText = (js) =>
  `module.exports = ${JSON.stringify(js, null, 2)}`;

const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'test';

module.exports = ({ bookingsLength, servicesLength, customersLength }) => {
  let customers = createCustomers(customersLength);
  let services = createServices(servicesLength);
  const bookings = shops
    .map((_, index) =>
      createBookings(services, customers, bookingsLength, index + 1)
    )
    .flat();

  customers = customers.map(({ customer_id, ...rest }) => rest);
  services = services.map(({ service_id, ...rest }) => rest);

  mkdir(`./data/${ENV}-data`)
    .catch(() => console.log('Overwriting existing files in /data'))
    .then(() => {
      return writeFile(
        `./data/${ENV}-data/customers.js`,
        generateFileText(customers),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./data/${ENV}-data/shops.js`,
        generateFileText(shops),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./data/${ENV}-data/services.js`,
        generateFileText(services),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./data/${ENV}-data/bookings.js`,
        generateFileText(bookings),
        'utf8'
      );
    });
};
