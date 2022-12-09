const { faker } = require('@faker-js/faker');

const createRandomCustomer = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const customer_name = `${firstName} ${lastName}`;
  const email = faker.internet.email(firstName, lastName);
  return { customer_name, email };
};
const generate = (randomList, listLength, generator, id) => {
  if (listLength === 0) return randomList;
  const randomItem = generator();
  randomItem.customer_id = listLength;

  return generate([randomItem, ...randomList], --listLength, generator);
};

const createCustomers = (customersQty) => {
  const customers = generate(
    [],
    customersQty,
    createRandomCustomer,
    'customer_id'
  );

  return customers;
};
module.exports = createCustomers;
