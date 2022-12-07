const { faker } = require('@faker-js/faker');
const { sample } = require('lodash');

const generateUniques = (randomList, listLength, generator) => {
  if (listLength === 0) return randomList;
  const randomItem = generator();
  if (randomList.includes(randomItem))
    return generateUniques(randomList, listLength, generator);
  return generateUniques([randomItem, ...randomList], --listLength, generator);
};

const createServices = (serviceCount) => {
  return Array.from({ length: serviceCount }, (service, i) => {
    return {
      service_id: i + 1,
      service_name: `${faker.company.catchPhrase()}`,
      duration: sample([30, 60, 90]),
      price: sample([25, 40, 50, 70]),
      type: sample(['Facial', 'Manicure and Pedicure', 'Laser', 'Body']),
    };
  });
};

module.exports = createServices;
