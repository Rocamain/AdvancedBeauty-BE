const {
  throwDatesErrors,
  throwPutPostBookingErrors,
} = require('./utils/index');

exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
};

exports.withErrorHandling = (controller) => {
  return async (req, res, next) => {
    try {
      throwDatesErrors(req);
      throwPutPostBookingErrors(req);

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

exports.validationErrors = (err, req, res, next) => {
  if (err?.name === 'SequelizeValidationError') {
    const validationErr =
      err.errors[0].message === 'Validation isIn on type failed'
        ? `Invalid input on ${err.errors[0].path}, available options:${err.errors[0].validatorArgs}`
        : err.errors[0].message;

    res.status(400).send({
      msg: `Bad request: ${validationErr}`,
    });
  }
  next(err);
};

exports.SQLErrors = (err, req, res, next) => {
  const errorCodes = {
    23505: 'Unique constrain error',
    22007: 'Invalid date',
    42703: 'Query field does not exist',
    '22P02': 'Invalid value type',
    42883: 'Invalid value type',
  };

  const SQLCode = err?.parent?.code;
  const SQLErr = errorCodes[SQLCode];

  if (SQLErr) {
    res.status(400).send({
      msg: `Bad request: ${SQLErr}`,
    });
  } else {
    next(err);
  }
};

exports.methodNotAllowed = (req, res) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
