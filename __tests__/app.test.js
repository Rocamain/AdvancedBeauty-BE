process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const app = require('../app');
const db = require('../models/index');
const request = supertest(app);

describe('Test search feature', () => {
  beforeAll(async () => {
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
    test('should return status code 400 for wrong date format(string)', async () => {
      const { status, body } = await request.get(
        '/customers?createdAt=notADate'
      );
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid date value');
    });
    test('should return status code 400 for wrong date format(number)', async () => {
      const { status, body } = await request.get('/customers?createdAt=23');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid date value');
    });
  });

  // Test suite for testing the CUSTOMERS ROUTES

  describe('Customers routes,', () => {
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
    });
    describe('/customers Errors', () => {
      test('should return status code 400 to unique email validation error', async () => {
        const { body, status } = await request
          .post('/customers')
          .send({ customerName: 'Javier Roca', email: 'Javier_R@yahoo.com' });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Unique constrain error');
      });
      test('should return status code 400 to minimum length validation error', async () => {
        const { body, status } = await request
          .post('/customers')
          .send({ customerName: 'Jav', email: 'Jav@yahoo.com' });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on customerName failed');
      });
      test('should return status code 400:wrong email format', async () => {
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
    });
    describe('/customers/:id Errors', () => {
      test('Updating a customer with customerName with numbers should return status code 400', async () => {
        const { status, body } = await request.put('/customers/10').send({
          customerName: 11111,
          email: 'emailChanged@email.com',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Updating a customer with not valid email should return status code 400', async () => {
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

  // Test suite for SERVICES ROUTES

  describe('Services route', () => {
    describe('/services', () => {
      test('Get: getAllServices should return status code 200', async () => {
        const { status, body } = await request.get('/services');
        const { services } = body;

        expect(status).toBe(200);
        expect(services).toHaveLength(10);
        services.forEach(
          ({ id, serviceName, duration, type, updatedAt, createdAt }) => {
            expect(typeof id).toBe('number');
            expect(typeof serviceName).toBe('string');
            expect(typeof duration).toBe('number');
            expect(typeof type).toBe('string');
            expect(new Date(updatedAt)).toBeInstanceOf(Date);
            expect(new Date(createdAt)).toBeInstanceOf(Date);
          }
        );
      });
      test('Get: getAllServices Query(serviceName) exact match return  should return status code 200', async () => {
        const { status, body } = await request.get(
          '/services?serviceName=Extended heuristic service-desk'
        );
        const { services } = body;
        const { id, serviceName, duration, type } = services[0];

        expect(status).toBe(200);
        expect(services).toHaveLength(1);
        expect(id).toBe(10);
        expect(serviceName).toBe('Extended heuristic service-desk');
        expect(duration).toBe(30);
        expect(type).toBe('Manicure and Pedicure');
      });
      test('Get: getAllServices Query(type and duration) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/services?type=facial&duration=30'
        );
        const { services } = body;

        expect(status).toBe(200);
        expect(services).toHaveLength(2);
        expect(services[0].id).toBe(1);
        expect(services[0].duration).toBe(30);
        expect(services[0].type).toBe('Facial');
        expect(services[1].id).toBe(8);
        expect(services[1].duration).toBe(30);
        expect(services[1].type).toBe('Facial');
      });
    });
    describe('/services Errors', () => {
      test('should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get(
          '/services?iDoNotExist=Hello'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('should return status code 400 for query(duration) an invalid input type', async () => {
        const { status, body } = await request.get('/services?duration=NAN');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid input value type');
      });
      test('should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get('/services?createdAt=111');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date value');
      });
      test('should return status code 400 for query(createdAt) an invalid input type string', async () => {
        const { status, body } = await request.get(
          '/services?createdAt=string'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date value');
      });
    });
  });
  // Test suite for testing the SHOPS ROUTES

  describe('Shops routes', () => {
    describe('/shops', () => {
      test('Get: getAllShops should return status code 200', async () => {
        const { status, body } = await request.get('/shops');
        const { shops } = body;

        expect(status).toBe(200);
        expect(shops).toHaveLength(3);
        shops.forEach(
          ({ id, shopName, city, street, postcode, phone, mobile }) => {
            expect(typeof id).toBe('number');
            expect(typeof shopName).toBe('string');
            expect(typeof city).toBe('string');
            expect(typeof street).toBe('string');
            expect(typeof postcode).toBe('string');
            expect(typeof mobile).toBe('string');
            expect(typeof phone).toBe('string');
          }
        );
      });
      test('Get: getAllShops Query(shopName) exact match (is not case sensitive) return  should return status code 200', async () => {
        const { status, body } = await request.get('/shops?shopName=Turo park');

        const { id, shopName, city, street, postcode, phone, mobile } =
          body.shops[0];
        expect(status).toBe(200);
        expect(id).toBe(1);
        expect(shopName).toBe('Turo Park');
        expect(city).toBe('Barcelona');
        expect(street).toBe('C/ Tenor Viñas, 3');
        expect(postcode).toBe('08021 – Barcelona');
        expect(mobile).toBe('640 725 934');
        expect(phone).toBe('93 200 96 56');
      });
    });
    describe('/shops Errors', () => {
      test('should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get('/shops?iDoNotExist=Hello');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('should return status code 400 for query(id) an invalid input type', async () => {
        const { status, body } = await request.get('/shops?id=NAN');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid input value type');
      });

      test('should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get('/shops?createdAt=111');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date value');
      });
      test('should return status code 400 for query(updatedAt) an invalid input type string', async () => {
        const { status, body } = await request.get('/shops?updatedAt=string');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date value');
      });
    });
  });

  // Test suite for testing the BOOKINGS ROUTE

  describe('Bookings routes', () => {
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
      test('Post: should return status code 201 (not case sensitive) for an existing user', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'darlene Murray',
          email: 'Darlene_murray40@yahoo.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'palma',
          appointment: '2023-01-02T15:10:00.000Z',
        });

        const { createdAt, updatedAt, ...restBooking } = body.booking;
        expect(status).toBe(201);
        expect(restBooking).toEqual({
          appointment: '02/01/2023',
          time: '15:10',
          id: 22,
          serviceId: 3,
          shopId: 3,
          customerId: 2,
          appointmentFinish: '2023-01-02T16:40:00.000Z',
        });
      });
      test('Post: should return status code 201 (not case sensitive) for a new user', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'New User',
          email: 'newUser@yahoo.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'turo park',
          appointment: '2023-11-02T11:00:00.000Z',
        });

        const { createdAt, updatedAt, ...restBooking } = body.booking;
        expect(status).toBe(201);
        expect(restBooking).toEqual({
          appointment: '02/11/2023',
          time: '11:00',
          appointmentFinish: '2023-11-02T12:30:00.000Z',
          customerId: 103,
          id: 23,
          serviceId: 3,
          shopId: 1,
        });
      });
    });

    describe('/bookings Errors', () => {
      test('Get: should return status code 400 for wrong date format(string)', async () => {
        const { status, body } = await request.get(
          '/bookings?updatedAt=notADate'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date value');
      });
      test('Get:should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get(
          '/bookings?iDoNotExist=Hello'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('Get: should return status code 400 for query value that does not exist', async () => {
        const { status, body } = await request.get('/bookings?duration=long');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid input value type');
      });
      test('Post: should return status code 400 for field(customerName) that cannot be number', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 111,
          email: 'newUser@yahoo.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'palma',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Post: should return status code 400 for field(appointment) that cannot be number', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 'fjrocavazquez@gmail.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'palma',
          appointment: 11111,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: appointment cannot be a number');
      });
      test('Post: should return status code 400 for a not valid email', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 'im_am_not_an_email.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'palma',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Email validation failed.');
      });
      test('Post: should return status code 400 for a not valid email(number)', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 1111,
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'palma',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Email validation failed.');
      });
      test('Post: should return status code 400 for a non existing shop', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 'fjrocavazquez@gmail.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'plma',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Shop not exist');
      });
      test('Post: should return status code 400 for a non existing service', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 'fjrocavazquez@gmail.com',
          serviceName: 'I am not existing',
          shopName: 'turo park',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Service not exist');
      });
      test('Post: should return status code 400 for a past date appointment', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Javier Roca',
          email: 'fjrocavazquez@gmail.com',
          serviceName: 'Reduced client-driven interface',
          shopName: 'turo park',
          appointment: '2022-01-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: cannot book a date in the past');
      });
      test('Post: should return status code 400 for an appointment date all ready taken', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'Jonh doe',
          email: 'jdoe@yahoo.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'turo park',
          appointment: '2023-11-02T11:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Appointment not available');
      });
    });
  });
});
