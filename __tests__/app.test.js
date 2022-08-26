process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app');
const db = require('../models/index');

const request = supertest(app);
const NOW = new Date();

console.log(NOW);

describe('Test search feature', () => {
  beforeAll(async () => {
    // Empty db  migrate models
    await db.Customer.sync({ alter: true });
  });
  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('Testing initial connection and route not found', () => {
    test('should return status code 200', async () => {
      const { status, body } = await request.get('/');
      const { msg } = body;
      expect(status).toBe(200);
      expect(msg).toBe('Ok');
    });
    test('should return status code 404 for route that does not exist', async () => {
      const { status, body } = await request.get('/notFound');
      const { msg } = body;
      expect(status).toBe(404);
      expect(msg).toBe('Route not found');
    });
  });

  // Test suite for testing the CUSTOMERS ROUTE

  describe('Customers route, /customers', () => {
    test('Get: should return status code 200', async () => {
      const { status, body } = await request.get('/customers');
      const { customers } = body;
      expect(status).toBe(200);
      expect(customers).toHaveLength(100);
      customers.forEach(({ id, customerName, email, createdAt, updatedAt }) => {
        expect(typeof id).toBe('number');
        expect(typeof customerName).toBe('string');
        expect(typeof email).toBe('string');
        expect(new Date(updatedAt)).toBeInstanceOf(Date);
        expect(new Date(createdAt)).toBeInstanceOf(Date);
      });
    });
    test('Get:/customers?offset=10&limit=5 should return status code 200, limit and offset apply', async () => {
      const { status, body } = await request.get(
        '/customers?offset=10&limit=5'
      );
      const { customers } = body;
      expect(status).toBe(200);
      expect(customers).toHaveLength(5);
      expect(customers[0].id).toBe(11);
    });

    test('Post: should return status code 201', async () => {
      const { body, status } = await request
        .post('/customers')
        .send({ customerName: 'Javier Roca', email: 'Javier_R@yahoo.com' });
      const { customer } = body;

      expect(status).toBe(201);
      expect(customer.id).toBe(101);
      expect(customer.customerName).toBe('Javier Roca');
      expect(customer.email).toBe('Javier_R@yahoo.com');
    });
    // CHECK HOW TO DO THIS TEST => ALL SEED IS CREATE A SAME TIME
    // test('Get: should return status code 200, can be query any field and createdAt can be query by range', async () => {
    //   const { body } = await request.get(
    //     `/customers?createdAtFrom=2022-08-18T08:00:00.000Z&createdAtTo=${NOW}`
    //   );
    //   console.log(body[0]);
    //   console.log(body[100]);
    // });
    test('Post: should return status code 400: email unique', async () => {
      const { body, status } = await request
        .post('/customers')
        .send({ customerName: 'Javier Roca', email: 'Javier_R@yahoo.com' });

      const { msg } = body;

      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Unique constrain error');
    });
    test('Post: should return status code 400:wrong email format', async () => {
      const { body, status } = await request
        .post('/customers')
        .send({ customerName: 'Jonh Doe', email: 'Jondoe_yahoo.com' });

      const { msg } = body;

      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Validation isEmail on email failed');
    });
  });
  describe('Customers route, /customers/:id', () => {
    test('Delete: should return status code 204', async () => {
      const { status } = await request.delete('/customers/1');
      const { body } = await request.get('/customers/1');
      const { customer } = body;

      expect(customer).toBe(null);
      expect(status).toBe(204);
    });
  });

  test('Put: should return status code 200:wrong email format', async () => {
    const { status } = await request
      .put('/customers/1')
      .send({ customerName: 'nameChange', email: 'emailChanged@a.com' });

    expect(status).toBe(200);
  });
});
