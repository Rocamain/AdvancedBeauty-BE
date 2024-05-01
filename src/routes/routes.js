const dbRouter = require('express').Router();
const customersRouter = require('./customers.routes');
const bookingsRouter = require('./bookings.routes');
const servicesRouter = require('./services.routes');
const shopsRouter = require('./shops.routes');
const contactRouter = require('./contact.routes');
const { routeNotFound } = require('../middlewares');

dbRouter.get('/api', (req, res, next) => res.send({ msg: 'Ok' }));
dbRouter.use('/api/shops', shopsRouter);
dbRouter.use('/api/bookings', bookingsRouter);
dbRouter.use('/api/services', servicesRouter);
dbRouter.use('/api/customers', customersRouter);
dbRouter.use('/api/contact', contactRouter);
dbRouter.use('/api/*', routeNotFound);
dbRouter.use('/*', routeNotFound);

module.exports = dbRouter;
