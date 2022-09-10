const { throwDatesErrors } = require('./utils/index');

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
};

exports.withErrorHandling = (controller) => {
  return async (req, res, next) => {
    try {
      throwDatesErrors(req);

      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.SQLErrors = (err, req, res, next) => {
  const errorCodes = {
    23505: 'Unique constrain error',
    22007: 'Invalid date',
    42703: 'Query field does not exist',
    '22P02': 'Invalid input value type',
    42883: 'Invalid input value type',
  };

  const getMessage = Boolean(err?.parent?.code)
    ? errorCodes[err.parent.code]
    : err.errors[0].message;

  res.status(400).send({
    msg: `Bad request: ${getMessage}`,
  });
  next(err);
};
