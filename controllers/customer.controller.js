const {
  fetchAllCustomers,
  postCustomer,
  getCustomerByPK,
  deleteCustomer,
  putCustomer,
} = require('../models/queries/customer.queries');

const getAllCustomers = (req, res, next) => {
  const { query } = req;

  fetchAllCustomers(query)
    .then((customers) => res.status(200).json({ customers }))
    .catch(next);
};

const createCustomer = (req, res, next) => {
  postCustomer(req.body)
    .then((customer) => res.status(201).json({ customer }))
    .catch(next);
};

const getCustomer = (req, res, next) => {
  getCustomerByPK(req.params)
    .then((customer) => {
      res.status(200).json(customer);
    })
    .catch(next);
};

const eraseCustomer = (req, res, next) => {
  deleteCustomer(req.params)
    .then((customer) => res.status(204).json({ customer }))
    .catch(next);
};

const updateCustomer = (req, res, next) => {
  const { body, params } = req;

  putCustomer({ ...params, ...body })
    .then((customer) => res.status(200).json({ customer }))
    .catch(next);
};

module.exports = {
  getAllCustomers,
  createCustomer,
  eraseCustomer,
  getCustomer,
  updateCustomer,
};
