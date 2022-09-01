const { fetchAllShops } = require('../shops.queries');
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
  const shop = await fetchAllShops({ shopName }).then(([shop]) => {
    const err = new Error();
    err.msg = 'Bad request: Shop not exist';
    err.status = 400;
    if (shop) {
      return {
        shopId: shop.dataValues.id,
      };
    }
    throw err;
  });
  return shop;
};

const getCustomerId = async ({ customerName, email }) => {
  const customer = await findOrCreateCustomer({
    customerName,
    email,
    bookingSearch: true,
  }).then((customer) => {
    if (customer.errors) {
      const err = new Error();
      if (customer.errors[0].message === 'email must be unique') {
        const err = new Error();
        err.msg = 'Bad request: Name value is not matching with the email';
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
};

const getIds = async ({ serviceName, shopName, customerName, email }) => {
  const { serviceId, duration } = await getServiceInfo({ serviceName });
  const { shopId } = await getShopId({ shopName });

  const { customerId } = await getCustomerId({ customerName, email });

  return {
    serviceId,
    shopId,
    customerId,
    duration,
  };
};

module.exports = { getIds };
