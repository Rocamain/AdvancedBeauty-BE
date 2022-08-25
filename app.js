const express = require('express');
const cors = require('cors');

const customerRouter = require('./routes/customer.routes.js');
const { routeNotFound, handleCustomErrors } = require('./middlewares');
const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(customerRouter);
app.all('/*', routeNotFound);

// handling errors
app.use(handleCustomErrors);
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

module.exports = app;
