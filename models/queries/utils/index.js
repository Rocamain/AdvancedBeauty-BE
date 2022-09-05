const { fetchAllShops } = require('../shops.queries.js');
const { fetchAllServices } = require('../services.queries');
const { findOrCreateCustomer } = require('../customers.queries');

const getServiceInfo = async ({ serviceName }) => {
  const service = await fetchAllServices({ serviceName }).then(([service]) => {
    const err = new Error();
    err.msg = 'Bad request: Service not exist';
    err.status = 400;
    if (service) {
      return {
        serviceId: service.dataValues.id,
        duration: service.dataValues.duration,
      };
    }
    throw err;
  });
  return service;
};

const getShopId = async ({ shopName }) => {
  try {
    const shop = await fetchAllShops({ shopName }).then((shop) => {
      if (shop.length === 0) {
        const err = new Error();
        err.msg = 'Bad request: Shop not exist';
        err.status = 400;

        throw err;
      }
      return {
        shopId: shop[0].dataValues.id,
      };
    });

    return shop;
  } catch (err) {
    throw err;
  }
};

const getCustomerId = async ({ customerName, email }) => {
  try {
    const customer = await findOrCreateCustomer({
      customerName,
      email,
    }).then((customer) => {
      if (customer.errors) {
        const err = new Error();
        if (customer.errors[0].message === 'email must be unique') {
          const err = new Error();
          err.msg = 'Bad request: Name value is not matching with the email';
          err.status = 400;
          throw err;
        }
        if (
          customer.errors[0].message === 'Validation len on customerName failed'
        ) {
          const err = new Error();
          err.msg = 'Bad request: CustomerName minimum length failed.';
          err.status = 400;
          throw err;
        }
        if (
          customer.errors[0].message === 'Validation isEmail on email failed'
        ) {
          const err = new Error();
          err.msg = 'Bad request: Email validation failed.';
          err.status = 400;
          throw err;
        }

        err.errors = [{ message: customer.errors[0].message }];

        throw err;
      }

      return {
        customerId: customer.dataValues.id,
      };
    });
    return customer;
  } catch (err) {
    throw err;
  }
};

const getIds = async ({ serviceName, shopName, customerName, email }) => {
  try {
    const { serviceId, duration } = await getServiceInfo({
      serviceName,
    });

    const { shopId } = await getShopId({ shopName });

    const { customerId } = await getCustomerId({ customerName, email });

    return {
      serviceId,
      shopId,
      customerId,
      duration,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { getIds };
