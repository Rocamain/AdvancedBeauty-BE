const { Customer, Booking, sequelize, ...rest } = require('../models/index');
const fetchAllCustomers = require('../models/queries/customer.queries');

const getAllCustomers = (req, res, next) => {
  const { query } = req;

  fetchAllCustomers(query)
    .then((customers) => res.status(200).json(customers))
    .catch(next);
};
