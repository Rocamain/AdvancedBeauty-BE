const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swaggerSpecs');
const routes = require('./routes/routes');
const {
  handleCustomErrors,
  validationErrors,
  SQLErrors,
  jsonError,
} = require('./middlewares');

const app = express();

// Settings
app.set('port', process.env.PORT || 4000);
app.use(express.static('public'));

// Middlewares
if (process.env.NDE_ENV === 'test' || process.env.NDE_ENV === 'development') {
  app.use(morgan('tiny'));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});
app.use(routes);

// handling errors
app.use(jsonError);
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
