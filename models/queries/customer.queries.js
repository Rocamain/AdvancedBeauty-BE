const { Customer, sequelize } = require('../index');
const { Op } = require('sequelize');

const fetchAllCustomers = async ({
  limit,
  offset = 0,
  queryFields,
  createdAt,
  updatedAt,
  createdAtFrom = new Date(1900, 0, 1),
  createdAtTo = new Date(Date.now()),
}) => {
  try {
    const customers = await Customer.findAll({
      where: {
        ...queryFields,
        createdAt: { [Op.between]: [createdAtFrom, createdAtTo] },
      },
      offset: offset,
      limit: limit,
    });

    return customers;
  } catch (err) {
    return err;
  }
};

const postCustomer = ({ customerName, email }) => {
  const postNewCustomer = Customer.create({ customerName, email });

  return postNewCustomer;
};

const getCustomerByPK = async ({ id }) => {
  try {
    const customer = await Customer.findByPk(id);

    const [bookings] = await sequelize.query(
      `SELECT b.booking_id , sh.shop_name , s.service_name, b.appointment, b.appointment_finish , b.created_at, b.updated_at FROM bookings AS b JOIN customers as c ON b.customer_id = c.customer_id JOIN services as s ON b.service_id = s.service_id JOIN shops as sh ON b.shop_id = sh.shop_id WHERE b.customer_id=${id} ORDER BY b.appointment DESC`
    );

    return { customer, reservations: bookings };
  } catch (err) {
    return err;
  }
};

const deleteCustomer = async ({ id }) => {
  id = Number(id);

  try {
    const deletedUser = await Customer.destroy({ where: { id: id } });

    return {};
  } catch (err) {
    return err;
  }
};
const putCustomer = async ({ customerName, email, id }) => {
  id = Number(id);
  try {
    const customer = await Customer.findByPk(id);

    await customer.update({ customerName, email });

    await customer.save();

    return customer;
  } catch (err) {
    return err;
  }
};

module.exports = {
  fetchAllCustomers,
  postCustomer,
  deleteCustomer,
  getCustomerByPK,
  putCustomer,
};
