const express = require('express');
const cors = require('cors');

const customerRouter = require('./routes/customers.routes');
const bookingsRouter = require('./routes/bookings.routes');
const servicesRouter = require('./routes/services.routes');
const shopsRouter = require('./routes/shops.routes');

const {
  routeNotFound,
  handleCustomErrors,
  SQLErrors,
} = require('./middlewares');

const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Ok' });
});
app.use(customerRouter);
app.use(bookingsRouter);
app.use(servicesRouter);
app.use(shopsRouter);
app.all('*', routeNotFound);

// handling errors
app.use(handleCustomErrors);
app.use(SQLErrors);
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

module.exports = app;
