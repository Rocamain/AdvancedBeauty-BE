const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '2U Booking Db - OpenAPI 3.0',
      description: `This is an open API that is part of one of my portfolio Projects, 2U Aesthetics, a website were you can make reservations of services.`,
      contact: {
        name: 'me',
        email: 'frocavazquez@gmail.com',
      },
      version: '1.0.0',
      license: {
        name: 'License: Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    portfolio: {
      link: 'http://localhost:3000/confirmation',
    },
    tags: [
      { name: 'Customers', description: 'Access Customers info' },
      { name: 'Shops', description: 'Access to Shops info' },
      { name: 'Services', description: 'Access to Services info' },
      {
        name: 'Bookings',
        description:
          'Get bookings info and find out booking availability for a specific date',
      },
    ],
    externalDocs: {
      description: 'Portfolio',
      url: 'http://swagger.io',
    },
    servers: [
      {
        url: 'http://localhost:9000/',
        description: 'Development server',
      },
      {
        url: 'https://advancedbeauty-be-production.up.railway.app',
        description: 'Production server',
      },
    ],
  },
  apis: [`${path.join(__dirname, './routes/*.js')}`],
};

const swaggerSpecs = swaggerJsDoc(options);

module.exports = swaggerSpecs;
