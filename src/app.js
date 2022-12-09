const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const routes = require('./routes/routes');
const {
  handleCustomErrors,
  validationErrors,
  SQLErrors,
} = require('./middlewares');
const swaggerSpecs = require('./utils/swaggerSpecs');

const app = express();

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(routes);

// handling errors
app.use(handleCustomErrors);
app.use(validationErrors);
app.use(SQLErrors);
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

module.exports = app;
