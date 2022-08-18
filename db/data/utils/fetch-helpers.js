const { faker } = require('@faker-js/faker');
const { sample } = require('lodash');
const { promisify } = require('util');
const { addHours, addMinutes, format } = require('date-fns');
const {
  checkOverlappedBookings,
  sortByAppointment,
  workingDays,
} = require('./bookings-utils');
const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const ENV = process.env.NODE_ENV === 'development' ? 'dev' : 'test';

const generateUniques = (randomList, listLength, generator) => {
  if (listLength === 0) return randomList;
  const randomItem = generator();
  if (randomList.includes(randomItem))
    return generateUniques(randomList, listLength, generator);
  return generateUniques([randomItem, ...randomList], --listLength, generator);
};

const generateBookings = (
  services,
  customers,
  bookingsLength,
  shopID,
  bookings = []
) => {
  if (bookingsLength <= 0) {
    const cleanBookingDates = bookings.map(
      ({ appointment, appointmentFinish, ...booking }) => ({
        ...booking,
        appointment: format(appointment, "MM/dd/yyyy 'at' h:mm a"),
        appointmentFinish: format(appointmentFinish, "MM/dd/yyyy 'at' h:mm a"),
      })
    );
    return cleanBookingDates;
  }

  const confirmedReservations = Array(bookingsLength)
    .fill()
    .concat(bookings)
    .reduce(
      (previousBookings, currentBooking, i) => {
        const randomHour = sample([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        const date =
          ENV === 'dev' ? sample(workingDays) : new Date(2022, 7, 19);
        const appointment = addHours(date, randomHour);
        const { service_id, duration } = sample(services);
        const { customer_id } = sample(customers);

        const newBooking = {
          booking_id: `${shopID}-${i + 1}`,
          shop_id: shopID,
          service_id,
          customer_id,
          appointment,
          appointmentFinish: addMinutes(appointment, duration),
        };

        if (checkOverlappedBookings(newBooking, previousBookings).length > 0) {
          return [...previousBookings];
        }

        return sortByAppointment([...previousBookings, newBooking]);
      },

      []
    );

  const totalBookingsCompleted = bookings.length;

  return generateBookings(
    services,
    customers,
    bookingsLength - totalBookingsCompleted,
    shopID,
    confirmedReservations
  );
};

const createRandomFirstName = () => faker.name.firstName();
const createRandomSurname = () => faker.name.lastName();
const uniqueFirstNames = generateUniques(
  [],
  100,
  createRandomFirstName,
  'firstNames'
);
const uniqueSurNames = generateUniques(
  [],
  100,
  createRandomSurname,
  'surNames'
);

const generateCustomers = (firstNames, surNames) => {
  return firstNames.map((firstName, i) => {
    return {
      customer_id: i + 1,
      customer_name: `${firstName} ${surNames[i]}`,
      email: faker.internet.email(firstName, surNames[i]),
    };
  });
};

const generateServices = (shops, serviceCount) => {
  return Array.from({ length: serviceCount }, (service, i) => {
    return {
      service_id: i,
      service_name: `${faker.company.catchPhrase()} `,
      duration: sample([30, 60, 90]),
      type: sample(['Facial', 'Manicure and Pedicure', 'Laser', 'Body']),
    };
  });
};

const generateFileText = (js) =>
  `module.exports = ${JSON.stringify(js, null, 2)}`;

module.exports = ({ bookingsLength, servicesLength }) => {
  const customers = generateCustomers(uniqueFirstNames, uniqueSurNames);

  const shops = [
    { shop_id: 1, shop_name: 'Turo Park' },
    { shop_id: 2, shop_name: "L'Illa Diagonal" },
    { shop_id: 3, shop_name: 'Palma de Majorca' },
  ];

  const services = generateServices(shops, servicesLength);

  const bookings = shops.map(({ shop_id }) =>
    generateBookings(services, customers, bookingsLength, shop_id)
  );

  mkdir(`./db/data/${ENV}-data`)
    .catch(() => console.log('Overwriting existing files in db/data'))
    .then(() => {
      return writeFile(
        `./db/data/${ENV}-data/customers.js`,
        generateFileText(customers),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./db/data/${ENV}-data/shops.js`,
        generateFileText(shops),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./db/data/${ENV}-data/services.js`,
        generateFileText(services),
        'utf8'
      );
    })
    .then(() => {
      return writeFile(
        `./db/data/${ENV}-data/bookings.js`,
        generateFileText(bookings),
        'utf8'
      );
    });
};
