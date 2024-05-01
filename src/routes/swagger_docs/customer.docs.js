const customersList = {
  tags: ['Customer'],
  description: 'Get all customers.',
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
        enum: ['id', 'customerName', 'createdAt', 'updatedAt'],
      },
    },
    {
      $ref: '#/parameters/customerName',
    },
    {
      $ref: '#/parameters/email',
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
              customers: [
                {
                  id: 1,
                  customerName: 'Titus Salt',
                  email: 'titussalt@example.com',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 2,
                  customerName: 'Luke Skywalker',
                  email: 'skywalker@example.com',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: 3,
                  customerName: 'Ellen Henry',
                  email: 'e.henry@example.com',
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
const createCustomer = {
  tags: ['Customer'],
  description: 'Create a new customer.',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              required: 'true',
              example: 'type a name',
            },
            email: {
              type: 'string',
              required: 'true',
              example: 'type an email',
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
              customer: {
                id: 17,
                customerName: 'Titus Salt',
                email: 'titussalt@example.com',
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
  tags: ['Customer'],
  description: 'Get a customer by id params.',
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
              customer: {
                id: 11,
                customerName: 'Melany Conn',
                email: 'Melany42@gmail.com',
                createdAt: '2022-12-13T12:41:07.718Z',
                updatedAt: '2022-12-13T12:41:07.718Z',
                reservations: [
                  {
                    booking_id: 2,
                    shop_name: 'Turo Park',
                    service_name: 'Reactive homogeneous moderator',
                    appointment: '2023-08-08T16:00:00.000Z',
                    appointment_finish: '2023-08-08T17:00:00.000Z',
                    created_at: '2022-12-13T12:41:07.719Z',
                    updated_at: '2022-12-13T12:41:07.719Z',
                  },
                  {
                    booking_id: 6,
                    shop_name: 'Palma de Majorca',
                    service_name: 'Reactive holistic projection',
                    appointment: '2023-04-24T13:00:00.000Z',
                    appointment_finish: '2023-04-24T14:00:00.000Z',
                    created_at: '2022-12-13T12:41:07.719Z',
                    updated_at: '2022-12-13T12:41:07.719Z',
                  },
                ],
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
const modifyCustomer = {
  tags: ['Customer'],
  description: 'Modify a customer by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  requestBody: {
    description: 'Change one or more of the properties: customerName, email.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              required: 'true',
              example: 'New Name',
            },
            email: {
              type: 'string',
              required: 'true',
              example: 'new.name@example.com',
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
                id: 1,
                customerName: 'New Name',
                email: 'new.name@example.com',
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

const deleteCustomer = {
  tags: ['Customer'],
  description: 'Delete a customer by id params.',
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
              customer: null,
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

const customerRouteDoc = {
  '/customers': {
    get: customersList,
    post: createCustomer,
  },
  '/customers/{id}': {
    get: getCustomerById,
    put: modifyCustomer,
    delete: deleteCustomer,
  },
};

module.exports = customerRouteDoc;
