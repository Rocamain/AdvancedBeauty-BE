exports.routeNotFound = (req, res) => {
  res.status(404).send({ msg: 'Route not found' });
};

exports.withErrorHandling = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err });
  else next(err);
};
