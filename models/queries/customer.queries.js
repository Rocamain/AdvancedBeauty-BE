const { Customer } = require('../index');
const { Op } = require('sequelize');

const fetchAllCustomers = ({
  limit,
  offset = 0,
  queryFields,
  createdAt,
  updatedAt,
  createdAtFrom = new Date(1900, 0, 1),
  createdAtTo = new Date(Date.now()),
}) => {
  console.log('mdel');
  try {
    const customers = Customer.findAll({
      where: {
        ...queryFields,
        createdAt: { [Op.between]: [createdAtFrom, createdAtTo] },
      },
      offset: offset,
      limit: limit,
    });
    return customers;
  } catch (err) {
    console.log(err);
  }
};

module.exports = fetchAllCustomers;
