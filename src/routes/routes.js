const dbRouter = require('express').Router();
const customersRouter = require('./customers.routes');
const bookingsRouter = require('./bookings.routes');
const servicesRouter = require('./services.routes');
const shopsRouter = require('./shops.routes');
const contactRouter = require('./contact.routes');
const { routeNotFound } = require('../middlewares');

dbRouter.use('/shops', shopsRouter);
dbRouter.use('/bookings', bookingsRouter);
dbRouter.use('/services', servicesRouter);
dbRouter.use('/customers', customersRouter);
dbRouter.use('/contact', contactRouter);
dbRouter.use('*', routeNotFound);

module.exports = dbRouter;
