const bookingsList = {
  tags: ['Booking'],
  description: 'Get all bookings.',
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
        enum: [
          'id',
          'customerId',
          'shopId',
          'serviceId',
          'createdAt',
          'updatedAt',
        ],
      },
    },
    {
      name: 'customerId',
      in: 'query',
      schema: {
        type: 'integer',
      },
    },
    {
      name: 'shopId',
      in: 'query',
      schema: {
        type: 'integer',
      },
    },
    {
      name: 'serviceId',
      in: 'query',
      schema: {
        type: 'integer',
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
              bookings: [
                {
                  time: '9:00',
                  id: 3,
                  appointment: '2022-10-15T09:00:00.000Z',
                  appointmentFinish: '2022-10-15T10:00:00.000Z',
                  createdAt: '2022-12-13T12:41:07.719Z',
                  updatedAt: '2022-12-13T12:41:07.719Z',
                  customerInfo: {
                    id: 15,
                    customerName: 'Helen Daugherty',
                    email: 'Helen19@hotmail.com',
                  },
                  serviceInfo: {
                    id: 9,
                    serviceName: 'Reactive homogeneous moderator',
                    type: 'Body',
                    price: 40,
                    duration: 60,
                  },
                  shopInfo: {
                    id: 2,
                    shopName: "L'Illa Diagonal",
                  },
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
const createBooking = {
  tags: ['Booking'],
  description: 'Create a new Booking.',
  requestBody: {
    content: {
      'application/json': {
        required: ['appointment'],
        schema: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              required: true,
              example: 'Francisco Javier Roca',
            },
            email: {
              type: 'string',
              required: 'true',
              example: 'fjrocavazquez@gmail.com',
            },
            serviceName: {
              type: 'string',
              required: 'true',
              example: 'Make a request to services/ to get a service name',
            },
            shopName: {
              type: 'string',
              required: 'true',
              example: 'Make a request to shops/ to get a shop name',
            },
            appointment: {
              type: 'string',
              format: 'date-time',
              example:
                'make first a request to bookings/available?serviceName={serviceName}&serviceName={serviceName}&date={DD/MM/YYY}&shopName={shopName} to get a available appointment',
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

const getBookingById = {
  tags: ['Booking'],
  description: 'Get a booking by id params.',
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
              booking: {
                id: 1,
                customerName: 'Helen Daugherty',
                email: 'Helen19@hotmail.com',
                shopName: 'Turo Park',
                appointment: '2023-06-24T13:00:00.000Z',
                appointmentFinish: '2023-06-24T13:30:00.000Z',
                createdAt: '2022-12-13T12:41:07.719Z',
                updatedAt: '2022-12-13T12:41:07.719Z',
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

const modifyBooking = {
  tags: ['Booking'],
  description: 'Modify a booking by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  requestBody: {
    description:
      'Change one or more of the properties: shopId, serviceId, customerId, appointment.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            customerName: {
              type: 'string',
              required: 'true',
              example: 'Radom Name',
            },
            email: {
              type: 'string',
              required: 'true',
              example: 'radom.name@example.com',
            },
            appointment: {
              type: 'string',
              format: 'date-time',
              required: 'true',
              example:
                'make first a request to bookings/available?serviceName={serviceName}&serviceName={serviceName}&date={DD/MM/YYY}&shopName={shopName} to get a available appointment',
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
const deleteBooking = {
  tags: ['Booking'],
  description: 'Modify a Booking by id params.',
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
              booking: null,
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

const getAvailableBookings = {
  tags: ['Booking'],
  description:
    'Get available bookings for a particular service in shop in a particular date.',
  parameters: [
    {
      name: 'shopName',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['Palma de Majorca', 'Turo Park', "L'Illa diagonal"],
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
      name: 'date',
      description: 'format: DD/MM/YYYY . Cannot be a date in the past',
      in: 'query',
      schema: {
        type: 'string',
      },
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
              bookings: {
                availableBookings: [
                  '2023-01-22T09:00:00.000Z',
                  '2023-01-22T11:00:00.000Z',
                  '2023-01-22T11:30:00.000Z',
                  '2023-01-22T16:00:00.000Z',
                  '2023-01-22T16:30:00.000Z',
                  '2023-01-22T17:00:00.000Z',
                  '2023-01-22T19:00:00.000Z',
                ],
                availableTimes: [
                  '9:00',
                  '11:00',
                  '11:30',
                  '12:00',
                  '16:00',
                  '16:30',
                  '17:00',
                  '19:00',
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
const bookingsRouteDoc = {
  '/bookings': {
    get: bookingsList,
    post: createBooking,
  },
  '/bookings/{id}': {
    get: getBookingById,
    put: modifyBooking,
    delete: deleteBooking,
  },
  '/bookings/available': {
    get: getAvailableBookings,
  },
};

module.exports = bookingsRouteDoc;
