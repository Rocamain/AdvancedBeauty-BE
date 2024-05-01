const shops = require('../../data/dev-data/shops');
const services = require('../../data/dev-data/services');
const customers = require('../../data/dev-data/customers');
const bookings = require('../../data/dev-data/bookings');

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
