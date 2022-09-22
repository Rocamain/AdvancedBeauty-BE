const {
  fetchAllServices,
  postService,
  getServiceByPK,
  deleteService,
  putService,
} = require('../models/queries/services.queries');

const { checkIsNum } = require('./utils/index');

const getAllServices = (req, res, next) => {
  const { query } = req;

  fetchAllServices(query)
    .then((services) => res.status(200).json({ services }))
    .catch(next);
};

const createService = (req, res, next) => {
  const { body } = req;
  postService(body)
    .then((service) => {
      res.status(201).json({ service });
    })
    .catch(next);
};

const getService = (req, res, next) => {
  getServiceByPK(req.params)
    .then((service) => {
      res.status(200).json({ service });
    })
    .catch(next);
};
const eraseService = (req, res, next) => {
  deleteService(req.params)
    .then((service) => res.status(204).json({ service }))
    .catch(next);
};

const updateService = (req, res, next) => {
  const { id } = req.params;
  const { serviceName, type, price, status, duration } = req.body;

  putService({ serviceName, type, price, status, duration, id })
    .then((service) => {
      return res.status(203).json({ service });
    })
    .catch(next);
};

module.exports = {
  getAllServices,
  createService,
  getService,
  eraseService,
  updateService,
};
