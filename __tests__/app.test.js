process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app');
const db = require('../models/index');
const request = supertest(app);

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
    test('should return status code 400 for query field that does not exist', async () => {
      const { status, body } = await request.get('/customers?foo=sa');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Query field does not exist');
    });
    test('should return status code 400 for wrong date format', async () => {
      const { status, body } = await request.get(
        '/customers?createdAt=notADate'
      );
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid date');
    });
  });

  // Test suite for testing the CUSTOMERS ROUTE

  describe('Customers route,', () => {
    describe('/customers', () => {
      test('Get: getAllCustomers should return status code 200', async () => {
        const { status, body } = await request.get('/customers');
        const { customers } = body;
        expect(status).toBe(200);
        expect(customers).toHaveLength(100);
        customers.forEach(
          ({ id, customerName, email, createdAt, updatedAt }) => {
            expect(typeof id).toBe('number');
            expect(typeof customerName).toBe('string');
            expect(typeof email).toBe('string');
            expect(new Date(updatedAt)).toBeInstanceOf(Date);
            expect(new Date(createdAt)).toBeInstanceOf(Date);
          }
        );
      });
      test('Get: getAllCustomers Query(offset and limit) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/customers?offset=10&limit=5'
        );
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(5);
        expect(customers[0].id).toBe(11);
      });
      test('Get: getAllCustomers Query(orderBy customerName order DESC ) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/customers?orderBy=customerName&order=desc'
        );
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(100);
        expect(customers[0].customerName).toBe('Yvette Zemlak');
        expect(customers[99].customerName).toBe('Abdullah Fay');
      });
      test('Get: getAllCustomers Query(get the names which contains Dennis ) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/customers?customerName=Dennis'
        );
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(1);
        expect(customers[0].customerName).toBe('Dennis Leuschke');
      });
      test('Get: getAllCustomers Query field that does not exist should return status code 400', async () => {
        const { status, body } = await request.get(
          '/customers?IdontExist=Dennis'
        );
        const { msg } = body;

        expect(status).toBe(400);

        expect(msg).toBe('Bad request: Query field does not exist');
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
      // });
      test('Post: should return status code 400 to unique email validation error', async () => {
        const { body, status } = await request
          .post('/customers')
          .send({ customerName: 'Javier Roca', email: 'Javier_R@yahoo.com' });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Unique constrain error');
      });
      test('Post: should return status code 400 to minimum length validation error', async () => {
        const { body, status } = await request
          .post('/customers')
          .send({ customerName: 'Jav', email: 'Jav@yahoo.com' });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on customerName failed');
      });
      test('Post: should return status code 400:wrong email format', async () => {
        const { body, status } = await request
          .post('/customers')
          .send({ customerName: 'John Doe', email: 'Jondoe_yahoo.com' });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation isEmail on email failed');
      });
    });
    describe('/customers/:id', () => {
      test('get: should return status code 200', async () => {
        const { status, body } = await request.get('/customers/49');

        const { id, customerName } = body.customer;

        expect(status).toBe(200);
        expect(id).toBe(49);
        expect(customerName).toBe('Ora Kuvalis');
        expect(body.customer).toHaveProperty('reservations');
      });

      test('Delete: deleting as customer should return status code 204', async () => {
        const { status } = await request.delete('/customers/1');
        const { body } = await request.get('/customers/1');
        const { customer } = body;

        expect(customer).toBe(null);
        expect(status).toBe(204);
      });

      test('Put: updating a customer should return status code 200', async () => {
        const { status, body } = await request.put('/customers/10').send({
          customerName: 'nameChange',
          email: 'emailChanged@email.com',
        });

        const { id, customerName, email } = body.customer;

        expect(status).toBe(200);
        expect(id).toBe(10);
        expect(customerName).toBe('nameChange');
        expect(email).toBe('emailChanged@email.com');
      });
      test('Put: updating a customer with customerName with numbers should return status code 400', async () => {
        const { status, body } = await request.put('/customers/10').send({
          customerName: 11111,
          email: 'emailChanged@email.com',
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Put: updating a customer with not valid email should return status code 400', async () => {
        const { status, body } = await request.put('/customers/10').send({
          customerName: 'nameChange',
          email: 'notAEmail.com',
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation isEmail on email failed');
      });
    });
  });

  // Test suite for testing the BOOKINGS ROUTE

  describe('Bookings route,', () => {
    describe('/bookings', () => {
      test('Get: getAllBookings should return status code 200', async () => {
        const { status, body } = await request.get('/bookings');
        const { bookings } = body;
        expect(status).toBe(200);
        expect(bookings).toHaveLength(20);
        bookings.forEach(
          ({
            id,
            appointment,
            time,
            appointmentFinish,
            createdAt,
            updatedAt,
            customerInfo,
            serviceInfo,
            shopInfo,
          }) => {
            expect(typeof id).toBe('number');
            expect(new Date(appointment)).toBeInstanceOf(Date);
            expect(typeof time).toBe('string');
            expect(new Date(appointmentFinish)).toBeInstanceOf(Date);
            expect(new Date(updatedAt)).toBeInstanceOf(Date);
            expect(new Date(createdAt)).toBeInstanceOf(Date);
            expect(typeof customerInfo.id).toBe('number');
            expect(typeof customerInfo.customerName).toBe('string');
            expect(typeof customerInfo.email).toBe('string');
            expect(typeof serviceInfo.id).toBe('number');
            expect(typeof serviceInfo.serviceName).toBe('string');
            expect(typeof serviceInfo.duration).toBe('number');
            expect(typeof shopInfo.id).toBe('number');
            expect(typeof shopInfo.shopName).toBe('string');
          }
        );
      });
      test('Get: getAllBookings Query(orderBy appointment order DESC ) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/bookings?orderBy=appointment&order=asc'
        );
        const { bookings } = body;

        const sortedBookings = bookings.sort(
          (prevBooking, nextBooking) =>
            new Date(nextBooking.appointment) -
            new Date(prevBooking.appointment)
        );
        expect(status).toBe(200);
        expect(bookings[0]).toEqual(sortedBookings[0]);
        expect(bookings[10]).toEqual(sortedBookings[10]);
      });
    });
    test('Get: getAllBookings Query(filter by appointment range of date and shopName) should return status code 200', async () => {
      const { status, body } = await request.get(
        '/bookings?appointmentFrom=2022-08-19T09:00:00.000Z&appointmentTo=2022-08-19T11:00:00.000Z&shopName=Palma'
      );
      const { bookings } = body;

      expect(status).toBe(200);
      expect(bookings).toEqual([
        {
          appointment: '19/08/2022',
          time: '12:00',
          id: 16,
          appointmentFinish: '2022-08-19T12:30:00.000Z',
          createdAt: bookings[0].createdAt,
          updatedAt: bookings[0].updatedAt,
          customerInfo: {
            id: 6,
            customerName: 'Emory Towne',
            email: 'Emory_Towne23@hotmail.com',
          },
          serviceInfo: {
            id: 5,
            serviceName: 'Enhanced even-keeled structure',
            type: 'Body',
            duration: 90,
          },
          shopInfo: { id: 3, shopName: 'Palma' },
        },
        {
          appointment: '19/08/2022',
          time: '11:00',
          id: 15,
          appointmentFinish: '2022-08-19T11:00:00.000Z',
          createdAt: bookings[0].createdAt,
          updatedAt: bookings[0].updatedAt,
          customerInfo: {
            id: 7,
            customerName: 'Adella Harris',
            email: 'Adella_Harris@yahoo.com',
          },
          serviceInfo: {
            id: 7,
            serviceName: 'Managed value-added task-force',
            type: 'Manicure and Pedicure',
            duration: 60,
          },
          shopInfo: { id: 3, shopName: 'Palma' },
        },
      ]);
    });
    test('should return status code 400 for wrong date format', async () => {
      const { status, body } = await request.get(
        '/bookings?updatedAt=notADate'
      );
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid date');
    });
    test('should return status code 400 for for query field that does not exist', async () => {
      const { status, body } = await request.get('/bookings?iDoNotExist=Hello');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Query field does not exist');
    });
    test('should return status code 400 for for query value that does not exist', async () => {
      const { status, body } = await request.get('/bookings?duration=long');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid input value type');
    });
  });
});
