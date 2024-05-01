const swaggerJsDoc = require('swagger-jsdoc');
const bookingsRouteDoc = require('../routes/swagger_docs/booking.docs');
const customerRouteDoc = require('../routes/swagger_docs/customer.docs');
const servicesRouteDoc = require('../routes/swagger_docs/service.docs');
const shopRouteDoc = require('../routes/swagger_docs/shops.docs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Advanced Beauty Booking Db - OpenAPI 3.0',
      description: `This is an open API that is part of one of my portfolio Projects, Advanced Beauty Aesthetics, a website were you can make reservations of services.`,
      contact: {
        name: 'Francisco Javier Roca',
        email: 'frocavazquez@gmail.com',
      },
      version: '1.0.0',
      license: {
        name: 'License: Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    portfolio: {
      link: 'http://localhost:3000/tobeChange',
    },

    externalDocs: {
      description: 'Portfolio',
      url: 'http://swagger.io',
    },
    servers: [
      {
        url: 'https://advanced-beauty-booking.up.railway.app/api',
        description: 'Production server',
      },
      {
        url: 'http://localhost:9000/api',
        description: 'Dev server',
      },
    ],
    tags: [
      { name: 'Customer', description: 'Customer routes' },
      { name: 'Booking', description: 'Booking routes' },
      { name: 'Service', description: 'Service routes' },
      { name: 'Shop', description: 'Shop routes' },
    ],
    paths: {
      ...customerRouteDoc,
      ...servicesRouteDoc,
      ...bookingsRouteDoc,
      ...shopRouteDoc,
    },
    parameters: {
      id: {
        name: 'id',
        in: 'query',
        schema: { type: 'integer' },
      },
      idPath: {
        name: 'id',
        in: 'path',
        schema: { type: 'integer' },
      },
      customerName: {
        name: 'customerName',
        in: 'query',
        schema: { type: 'string' },
      },
      email: {
        name: 'email',
        in: 'query',
        schema: { type: 'string' },
      },
      limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer' },
        description: 'limit set on 20 by default',
      },
      offset: {
        name: 'offset',
        in: 'query',
        schema: { type: 'integer' },
        description: 'offset set on 0 by default',
      },
      order: {
        name: 'order',
        in: 'query',
        schema: { type: 'string', enum: ['asc', 'desc'] },
      },
      createdAt: {
        name: 'createdAt',
        in: 'query',
        schema: { type: 'string', format: 'date-time' },
      },
      updatedAt: {
        name: 'updatedAt',
        in: 'query',
        schema: { type: 'string', format: 'date-time' },
      },
      createdFrom: {
        name: 'createdFrom',
        in: 'query',
        description: 'search from ...',
        schema: { type: 'string', format: 'date-time' },
      },
      updatedFrom: {
        name: 'updatedFrom',
        in: 'query',
        description: 'search from ...',
        schema: { type: 'string', format: 'date-time' },
      },
      createdTo: {
        name: 'createdTo',
        in: 'query',
        description: 'search to ...',
        schema: { type: 'string', format: 'date-time' },
      },
      updatedTo: {
        name: 'updatedTo',
        in: 'query',
        description: 'search to ...',
        schema: { type: 'string', format: 'date-time' },
      },
    },
    definitions: {
      createCustomer: {
        required: ['customerName', 'email'],
        properties: {
          customerName: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
        },
      },
    },
    components: {
      schemas: {
        Customer: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 100,
            },
            customerName: {
              type: 'string',
              example: 'Javier Roca',
            },
            type: {
              name: 'type',
              example: 'Body',
              schema: {
                type: 'string',
                enum: ['Body', 'Laser', 'Manicure and Pedicure', 'Facial'],
              },
            },
            duration: {
              type: 'integer',
              example: 30,
            },
            price: {
              type: 'integer',
              example: 40,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
          },
        },
        Service: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 100,
            },
            serviceName: {
              type: 'string',
              example: 'Javier Roca',
            },
            type: {
              type: 'string',
              example: 'Laser',
              enum: ['Body', 'Laser', 'Manicure and pedicure', 'Facial'],
            },
            duration: {
              type: 'integer',
              example: 30,
            },
            price: {
              type: 'integer',
              example: 50,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 100,
            },
            shopId: {
              type: 'integer',
              example: 1,
            },
            serviceId: {
              type: 'integer',
              example: 3,
            },
            customerId: {
              type: 'integer',
              example: 2,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
          },
        },
        Shop: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 2,
            },
            shopName: {
              type: 'string',
              example: 'Palm de Majorca',
            },
            city: {
              type: 'string',
              example: 'Palma',
            },
            street: {
              type: 'integer',
              example: 'Constitucion 8',
            },
            postcode: {
              type: 'string',
              example: '28290',
            },
            phone: {
              type: 'string',
              example: 80288820,
            },
            mobile: {
              type: 'string',
              example: 21221331,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: new Date(),
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpecs = swaggerJsDoc(options);

module.exports = swaggerSpecs;
