const { Customer, sequelize } = require('../index');
const { Op } = require('sequelize');

const fetchAllCustomers = async ({
  limit = null,
  offset = 0,
  customerName,
  createdAt,
  updatedAt,
  createdFrom = new Date(1900, 0, 1),
  updatedFrom = new Date(1900, 0, 1),
  createdTo = new Date(Date.now()),
  updatedTo = new Date(Date.now()),
  order = 'ASC',
  orderBy = 'id',
  ...queryFields
}) => {
  const customers = await Customer.findAll({
    where: {
      ...queryFields,
      customerName: {
        [Op.regexp]: customerName ? `${customerName}` : '^[a-zA-Z]',
      },
      createdAt: {
        [Op.between]: [
          createdAt ? createdAt : createdFrom,
          createdAt ? createdAt : createdTo,
        ],
      },
      updatedAt: {
        [Op.between]: [
          updatedAt ? updatedAt : updatedFrom,
          updatedAt ? updatedAt : updatedTo,
        ],
      },
    },
    limit: limit,
    offset: offset,
    order: [[orderBy, order]],
  });

  return customers;
};

const postCustomer = async ({ customerName, email }) => {
  const postNewCustomer = await Customer.create({ customerName, email });

  return postNewCustomer;
};

const getCustomerByPK = async ({ id }) => {
  const customer = await Customer.findByPk(id);

  if (customer) {
    const [bookings] = await sequelize.query(
      `SELECT b.booking_id , sh.shop_name , s.service_name, b.appointment, b.appointment_finish , b.created_at, b.updated_at FROM bookings AS b JOIN customers as c ON b.customer_id = c.customer_id JOIN services as s ON b.service_id = s.service_id JOIN shops as sh ON b.shop_id = sh.shop_id WHERE b.customer_id=${id} ORDER BY b.appointment DESC`
    );

    return { ...customer.dataValues, reservations: bookings };
  }

  return null;
};

const deleteCustomer = async ({ id }) => {
  await Customer.destroy({ where: { id: id } });

  return `user ${id} has been deleted`;
};
const putCustomer = async ({ customerName, email, id }) => {
  const customer = await Customer.findByPk(id);

  if (customer) {
    await customer.update({ customerName, email });
    await customer.save();
    return customer;
  }
  return null;
};

module.exports = {
  fetchAllCustomers,
  postCustomer,
  deleteCustomer,
  getCustomerByPK,
  putCustomer,
};
