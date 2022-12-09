const shops = require('../data/test-data/shops');
const services = require('../data/test-data/services');
const customers = require('../data/test-data/customers');
const bookings = require('../data/test-data/bookings');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('shops', [...shops], {});
    await queryInterface.bulkInsert('services', [...services], {});
    await queryInterface.bulkInsert('customers', [...customers], {});
    await queryInterface.bulkInsert('bookings', [...bookings], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shops', null, {});
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('customers', null, {});
    await queryInterface.bulkDelete('bookings', null, {});
  },
};
