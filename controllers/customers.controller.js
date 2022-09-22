const {
  fetchAllCustomers,
  postCustomer,
  getCustomerByPK,
  deleteCustomer,
  putCustomer,
} = require('../models/queries/customers.queries');
const { checkIsNum } = require('./utils/index');

const getAllCustomers = (req, res, next) => {
  const { query } = req;

  fetchAllCustomers(query)
    .then((customers) => res.status(200).json({ customers }))
    .catch(next);
};

const createCustomer = (req, res, next) => {
  const { customerName } = req.body;
  const { isNum, numErrors } = checkIsNum([{ customerName }]);

  if (isNum) {
    const err = new Error();
    err.msg = `Bad request: ${numErrors[0]} cannot be a number`;
    err.status = 400;

    throw err;
  }
  postCustomer({ ...req.body })
    .then((customer) => res.status(201).json({ customer }))
    .catch(next);
};

const getCustomer = (req, res, next) => {
  getCustomerByPK(req.params)
    .then((customer) => {
      res.status(200).json({ customer });
    })
    .catch(next);
};

const eraseCustomer = (req, res, next) => {
  deleteCustomer(req.params)
    .then((customer) => res.status(204).json({ customer }))
    .catch(next);
};

const updateCustomer = (req, res, next) => {
  const { id } = req.params;
  const { email, customerName } = req.body;

  const { isNum, numErrors } = checkIsNum([{ email }, { customerName }]);

  if (isNum) {
    let err = new Error();
    err.msg = `Bad request: ${numErrors[0]} cannot be a number`;
    err.status = 400;
    throw err;
  }

  putCustomer({ id, email, customerName })
    .then((customer) => {
      return res.status(203).json({ customer });
    })
    .catch(next);
};

module.exports = {
  getAllCustomers,
  createCustomer,
  eraseCustomer,
  getCustomer,
  updateCustomer,
};
