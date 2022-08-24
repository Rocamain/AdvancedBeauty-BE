const { faker } = require('@faker-js/faker');
const { sample } = require('lodash');
const { promisify } = require('util');
const { addHours, addMinutes } = require('date-fns');
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
  shopId,
  bookings = []
) => {
  if (bookingsLength <= 0) {
    const cleanBookingDates = bookings.map(
      ({ appointment, appointmentFinish, ...restBooking }, i) => {
        return {
          ...restBooking,
          appointment: appointment,
          appointment_finish: appointmentFinish,
        };
      }
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
          shop_id: shopId,
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
    shopId,
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
      service_id: i + 1,
      service_name: `${faker.company.catchPhrase()}`,
      duration: sample([30, 60, 90]),
      type: sample(['Facial', 'Manicure and Pedicure', 'Laser', 'Body']),
    };
  });
};
const shops = [
  {
    shop_name: 'Turo Park',
    city: 'Barcelona',
    street: 'C/ Tenor Viñas, 3',
    postcode: '08021 – Barcelona',
    phone: '93 200 96 56',
    mobile: '640 725 934',
  },
  {
    shop_name: "L'Illa Diagonal",
    city: 'Barcelona',
    street: 'Avda. Diagonal, 569',
    postcode: '08029 – Barcelona',
    phone: '93 410 14 87',
    mobile: '640 725 935',
  },
  {
    shop_name: 'Palma',
    city: 'Palma de Majorca',
    street: 'C/ Josep Anselm Clavé, 6',
    postcode: '07002 – Palma de Mallorca',
    phone: '971 707 281',
    mobile: '646 531 481',
  },
];

const generateFileText = (js) =>
  `module.exports = ${JSON.stringify(js, null, 2)}`;

module.exports = ({ bookingsLength, servicesLength }) => {
  let customers = generateCustomers(uniqueFirstNames, uniqueSurNames);
  let services = generateServices(shops, servicesLength);
  let bookings = shops.map((_, index) =>
    generateBookings(services, customers, bookingsLength, index + 1)
  );

  bookings = [...bookings[0], ...bookings[1], ...bookings[2]];
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
