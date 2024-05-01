const { Customer, sequelize } = require('../models/index');
const { Op } = require('sequelize');

const fetchAllCustomers = async ({
  limit = null,
  offset = 0,
  customerName,
  email,
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
  try {
    const customers = await Customer.findAll({
      where: {
        ...queryFields,
        customerName: {
          [Op.iRegexp]: customerName ? `^${customerName}` : '[a-zA-Z]',
        },
        email: {
          [Op.iRegexp]: email ? `^${email}` : '^[a-zA-Z]',
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
  } catch (err) {
    throw err;
  }
};

const postCustomer = async ({ customerName, email }) => {
  return Customer.create({ customerName, email });
};

const getCustomerByPK = async ({ id }) => {
  try {
    const customer = await Customer.findByPk(id);

    if (customer) {
      const [bookings] = await sequelize.query(
        `SELECT b.booking_id , sh.shop_name , s.service_name, b.appointment, b.appointment_finish , b.created_at, b.updated_at FROM bookings AS b JOIN customers as c ON b.customer_id = c.customer_id JOIN services as s ON b.service_id = s.service_id JOIN shops as sh ON b.shop_id = sh.shop_id WHERE b.customer_id=${id} ORDER BY b.appointment DESC`
      );

      return { ...customer.dataValues, reservations: bookings };
    }

    return null;
  } catch (err) {
    throw err;
  }
};

const deleteCustomer = async ({ id }) => {
  try {
    await Customer.destroy({ where: { id: id } });
  } catch (err) {
    throw err;
  }
};

const putCustomer = async ({ customerName, email, id }) => {
  try {
    const customer = await Customer.findByPk(id);

    if (customer) {
      await customer.update({ customerName, email });
      await customer.save();
    }

    return customer;
  } catch (err) {
    throw err;
  }
};

const findOrCreateCustomer = async ({ email, customerName }) => {
  try {
    const customer = await Customer.findAll({
      where: {
        [Op.and]: [
          { customerName: customerName },
          { email: { [Op.iRegexp]: `^${email}$` } },
        ],
      },
    });

    if (customer.length === 0) {
      try {
        const newCustomer = await Customer.create({ customerName, email });
        return newCustomer;
      } catch (err) {
        throw err;
      }
    }

    return customer[0];
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
  findOrCreateCustomer,
};
