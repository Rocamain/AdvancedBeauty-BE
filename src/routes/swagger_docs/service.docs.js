const serviceList = {
  tags: ['Service'],
  description: 'Get all services.',
  parameters: [
    {
      $ref: '#/parameters/limit',
    },
    {
      $ref: '#/parameters/offset',
    },
    {
      $ref: '#/parameters/order',
    },
    {
      name: 'orderBy',
      description: 'By default on id.',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['id', 'serviceName', 'type', 'price', 'createdAt', 'updatedAt'],
      },
    },
    {
      name: 'serviceName',
      in: 'query',
      schema: {
        type: 'string',
      },
    },
    {
      name: 'type',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['Body', 'Laser', 'Manicure and Pedicure', 'Facial'],
      },
    },
    {
      $ref: '#/parameters/createdAt',
    },
    {
      $ref: '#/parameters/updatedAt',
    },
    {
      $ref: '#/parameters/createdFrom',
    },
    {
      $ref: '#/parameters/updatedFrom',
    },
    {
      $ref: '#/parameters/createdTo',
    },
    {
      $ref: '#/parameters/updatedTo',
    },
  ],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              services: [
                {
                  id: 1,
                  serviceName: 'Service name 1',
                  type: 'Facial',
                  price: 30,
                  duration: 45,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 2,
                  serviceName: 'Service name 2',
                  type: 'Manicure and pedicure',
                  price: 100,
                  duration: 25,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 3,
                  serviceName: 'Service name 3',
                  type: 'Body',
                  price: 45,
                  duration: 90,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const createService = {
  tags: ['Service'],
  description: 'Create a new customer',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            serviceName: {
              type: 'string',
              required: 'true',
              example: 'type a service name',
            },
            type: {
              type: 'string',
              required: 'true',
              example: 'choose Facial/Body/Manicure and pedicure/Laser',
            },
            price: {
              type: 'integer',
              required: 'true',
              example: 'type a price',
            },
            duration: {
              type: 'integer',
              required: 'true',
              example: 'type a duration',
            },
          },
        },
      },
    },
  },

  responses: {
    201: {
      description: 'Created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              service: {
                id: 10,
                serviceName: 'Service name 10',
                type: 'Manicure and Pedicure',
                price: 50,
                duration: 90,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const getCustomerById = {
  tags: ['Service'],
  description: 'Get a service by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  responses: {
    200: {
      description: 'Succeed',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              services: {
                id: 1,
                serviceName: 'Service name 1',
                type: 'Facial',
                price: 30,
                duration: 45,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const modifyService = {
  tags: ['Service'],
  description: 'Modify a service by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  requestBody: {
    description:
      'Change one or more of the properties: serviceName, type [Facial, Laser, Manicure and pedicure, Body ], price, duration.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            serviceName: {
              type: 'string',
              example: 'Service Changed',
            },
            type: {
              type: 'string',
              example: 'Facial',
            },
            duration: {
              type: 'integer',
              example: 40,
            },
            price: {
              type: 'integer',
              example: 20,
            },
          },
        },
      },
    },
  },
  responses: {
    203: {
      description: 'Modified',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              customer: {
                id: 17,
                serviceName: 'Service Changed',
                type: 'Facial',
                price: 40,
                duration: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const deleteService = {
  tags: ['Service'],
  description: 'Delete a service by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  responses: {
    204: {
      description: 'Deleted',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              service: null,
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const serviceRouteDoc = {
  '/services': {
    get: serviceList,
    post: createService,
  },
  '/services/{id}': {
    get: getCustomerById,
    put: modifyService,
    delete: deleteService,
  },
};

module.exports = serviceRouteDoc;
