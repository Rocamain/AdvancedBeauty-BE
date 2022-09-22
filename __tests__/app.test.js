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
      expect(msg).toBe('Bad request: Invalid date');
    });
    test('should return status code 400 for wrong date format(number)', async () => {
      const { status, body } = await request.get('/customers?createdAt=23');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Invalid date');
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
        expect(customers[0].customerName).toBe('Willy Gorczany');
        expect(customers[99].customerName).toBe('Adolf Reichel');
      });
      test('Get: getAllCustomers Query(get the names which contains Dennis ) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/customers?customerName=russell'
        );
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(1);
        expect(customers[0].customerName).toBe('Russell Fahey');
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
    });
    describe('/customers Errors', () => {
      test('should return status code 400 to unique email validation error', async () => {
        const { body, status } = await request.post('/customers').send({
          customerName: 'Javier Roca',
          email: 'Kaleigh.Prosacco@gmail.com',
        });
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
      test('should return status code 400:query field that does not exist should return status code 400', async () => {
        const { status, body } = await request.get(
          '/customers?IdontExist=Dennis'
        );
        const { msg } = body;

        expect(status).toBe(400);

        expect(msg).toBe('Bad request: Query field does not exist');
      });
    });

    describe('/customers/:id', () => {
      test('get: should return status code 200', async () => {
        const { status, body } = await request.get('/customers/49');

        const { id, customerName } = body.customer;

        expect(status).toBe(200);
        expect(id).toBe(49);
        expect(customerName).toBe('Russell Fahey');
        expect(body.customer).toHaveProperty('reservations');
      });

      test('Delete: deleting a customer should return status code 204', async () => {
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

        expect(status).toBe(203);
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
          '/services?serviceName=Open-source optimal paradigm'
        );
        const { services } = body;
        const { id, serviceName, duration, price, type } = services[0];

        expect(status).toBe(200);
        expect(services).toHaveLength(1);
        expect(id).toBe(1);
        expect(serviceName).toBe('Open-source optimal paradigm');
        expect(duration).toBe(30);
        expect(price).toBe(40);
        expect(type).toBe('Facial');
      });
      test('Get: getAllServices Query(type and duration) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/services?type=facial&duration=30'
        );
        const { services } = body;

        expect(status).toBe(200);
        expect(services).toHaveLength(1);
        expect(services[0].id).toBe(1);
        expect(services[0].duration).toBe(30);
        expect(services[0].price).toBe(40);
        expect(services[0].type).toBe('Facial');
      });
      test('Post: should return status code 201', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName: 'Amazing rock integration',
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { service } = body;

        expect(status).toBe(201);
        expect(service.id).toBe(11);
        expect(service.serviceName).toBe('Amazing rock integration');
        expect(service.duration).toBe(45);
        expect(service.price).toBe(50);
        expect(service.status).toBe(true);
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
        expect(msg).toBe('Bad request: Invalid value type');
      });
      test('should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get('/services?createdAt=111');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
      });
      test('should return status code 400 for query(createdAt) an invalid input type string', async () => {
        const { status, body } = await request.get(
          '/services?createdAt=string'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
      });
      test('should return status code 400 to unique serviceName validation error', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName: 'Amazing rock integration',
          duration: 45,
          price: 50,
          type: 'Facial',
        });
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Unique constrain error');
      });
      test('should return status code 400 to minimum length validation error', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName: 'short',
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on serviceName failed');
      });

      test('should return status code 400 to maximum length validation error', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName:
            'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on serviceName failed');
      });
      test('should return status code 400 to missing field in the  req body', async () => {
        const { body, status } = await request.post('/services').send({
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Service.serviceName cannot be null');
      });
      test('should return status code 400 to invalid input (duration)', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName: 'Fantastic java',
          duration: 'ten',
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type');
      });
      test('should return status code 400 to invalid input (type)', async () => {
        const { body, status } = await request.post('/services').send({
          serviceName: 'Fantastic java',
          duration: 'ten',
          price: 50,
          type: 'NOT A VALID TYPE',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe(
          'Bad request: Invalid input on type, available options:Facial,Body,Manicure and pedicure,Laser'
        );
      });
    });
    describe('/services:id', () => {
      test('Get: getService should return status code 200', async () => {
        const { status, body } = await request.get('/services/1');

        const { id, serviceName, duration, price, type, updatedAt, createdAt } =
          body.service;

        expect(status).toBe(200);
        expect(id).toBe(1);
        expect(serviceName).toBe('Open-source optimal paradigm');
        expect(duration).toBe(30);
        expect(price).toBe(40);
        expect(type).toBe('Facial');
        expect(body.service.status).toBe(true);
        expect(new Date(updatedAt)).toBeInstanceOf(Date);
        expect(new Date(createdAt)).toBeInstanceOf(Date);
      });
      test('Delete: deleting a service should return status code 204', async () => {
        const { status } = await request.delete('/services/11');
        const { body } = await request.get('/services/11');
        const { service } = body;

        expect(service).toBe(null);
        expect(status).toBe(204);
      });

      test('Delete: deleting a service that does not exist should return status code 204', async () => {
        const { status } = await request.delete('/services/1111');
        const { body } = await request.get('/services/1111');

        const { service } = body;

        expect(service).toBe(null);
        expect(status).toBe(204);
      });
      test('Put: updating a service should return status code 203', async () => {
        const { status, body } = await request.put('/services/1').send({
          serviceName: 'Updated Service',
          type: 'Facial',
          price: 100,
          duration: 120,
          status: false,
        });

        const { updatedAt, createdAt, ...service } = body.service;

        expect(status).toBe(203);
        expect(service).toEqual({
          id: 1,
          serviceName: 'Updated Service',
          duration: 120,
          price: 100,
          type: 'Facial',
          status: false,
        });
      });
    });
    describe('/services:id Errors', () => {
      test('should return status code 400 for an invalid ID field that does not exist', async () => {
        const { status, body } = await request.get('/services/NotID');

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type');
      });

      test('should return status code 400 for an invalid ID that does not exist should return status code 204', async () => {
        const { status, body } = await request.delete('/services/NotID');

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type');
      });
      test('Updating a service with a non valid input type(price) should return status code 400', async () => {
        const { status, body } = await request.put('/services/1').send({
          serviceName: 'Updated Service',
          type: 'Facial',
          price: 'hundred',
          duration: 120,
          status: false,
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type');
      });
      test('Updating a service with a non valid input  minimum length (serviceName) type(price) should return status code 400', async () => {
        const { status, body } = await request.put('/services/1').send({
          serviceName: 'short',
          type: 'Facial',
          price: 22,
          duration: 120,
          status: false,
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on serviceName failed');
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
        expect(msg).toBe('Bad request: Invalid value type');
      });
      test('should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get('/shops?createdAt=111');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
      });
      test('should return status code 400 for query(updatedAt) an invalid input type string', async () => {
        const { status, body } = await request.get('/shops?updatedAt=string');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
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
            expect(typeof serviceInfo.price).toBe('number');
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
          '/bookings?appointmentFrom=2022-11-19T09:00:00.000Z&appointmentTo=2022-11-19T11:00:00.000Z&shopName=Palma'
        );
        const { bookings } = body;

        expect(status).toBe(200);
        expect(bookings).toEqual([
          {
            appointment: '2022-11-19T09:00:00.000Z',
            time: '9:00',
            id: 18,
            appointmentFinish: '2022-11-19T10:00:00.000Z',
            createdAt: bookings[0].createdAt,
            updatedAt: bookings[0].updatedAt,
            customerInfo: {
              id: 25,
              customerName: 'Aurelie Kunze',
              email: 'Aurelie_Kunze@gmail.com',
            },
            serviceInfo: {
              id: 7,
              serviceName: 'Triple-buffered uniform capability',
              type: 'Body',
              price: 50,
              duration: 60,
            },
            shopInfo: { id: 3, shopName: 'Palma' },
          },
          {
            appointment: '2022-11-19T10:00:00.000Z',
            time: '10:00',
            id: 19,
            appointmentFinish: '2022-11-19T11:00:00.000Z',
            createdAt: bookings[1].createdAt,
            updatedAt: bookings[1].updatedAt,
            customerInfo: {
              id: 92,
              customerName: 'Eda Reinger',
              email: 'Eda9@gmail.com',
            },
            serviceInfo: {
              id: 7,
              serviceName: 'Triple-buffered uniform capability',
              type: 'Body',
              price: 50,
              duration: 60,
            },
            shopInfo: { id: 3, shopName: 'Palma' },
          },
          {
            appointment: '2022-11-19T11:00:00.000Z',
            time: '11:00',
            id: 20,
            appointmentFinish: '2022-11-19T12:00:00.000Z',
            createdAt: bookings[2].createdAt,
            updatedAt: bookings[2].updatedAt,
            customerInfo: {
              id: 73,
              customerName: 'Dusty Wolf',
              email: 'Dusty_Wolf33@gmail.com',
            },
            serviceInfo: {
              id: 4,
              serviceName: 'Customizable next generation alliance',
              type: 'Laser',
              price: 70,
              duration: 60,
            },
            shopInfo: { id: 3, shopName: 'Palma' },
          },
        ]);
      });
      test('Post: should return status code 201 (not case sensitive) with an existing user', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'darlene Murray',
          email: 'Darlene_murray40@yahoo.com',
          serviceName: 'Reverse-engineered mission-critical encryption',
          shopName: 'Palma',
          appointment: '2023-01-02T15:10:00.000Z',
        });

        const { createdAt, updatedAt, ...restBooking } = body.booking;
        expect(status).toBe(201);
        expect(restBooking).toEqual({
          appointment: '2023-01-02T15:10:00.000Z',
          shopId: 3,
          time: '15:10',
          appointmentFinish: '2023-01-02T15:40:00.000Z',
          customerId: 103,
          id: 26,
          serviceId: 2,
        });
      });
      test('Post: should return status code 201 (not case sensitive) for a new user', async () => {
        const { body, status } = await request.post('/bookings').send({
          customerName: 'New User',
          email: 'newUser@yahoo.com',
          serviceName: 'Horizontal radical structure',
          shopName: 'turo park',
          appointment: '2023-11-02T11:00:00.000Z',
        });

        const { createdAt, updatedAt, ...restBooking } = body.booking;
        expect(status).toBe(201);
        expect(restBooking).toEqual({
          time: '11:00',
          id: 27,
          serviceId: 3,
          shopId: 1,
          appointment: '2023-11-02T11:00:00.000Z',
          appointmentFinish: '2023-11-02T12:00:00.000Z',
          customerId: 104,
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
        expect(msg).toBe('Bad request: Invalid date');
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
        expect(msg).toBe('Bad request: Invalid value type');
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
          serviceName: 'Horizontal radical structure',
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
          serviceName: 'Horizontal radical structure',
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
          serviceName: 'Reverse-engineered mission-critical encryption',
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
          serviceName: 'Reverse-engineered mission-critical encryption',
          shopName: 'turo park',
          appointment: '2022-11-19T09:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Appointment not available');
      });
    });
    describe('/bookings/:id', () => {
      test('Get: getBookingById should return an booking  with status code 200)', async () => {
        const { status, body } = await request.get('/bookings/1');

        const { updatedAt, createdAt, ...booking } = body.booking;

        expect(status).toBe(200);
        expect(booking).toEqual({
          id: 1,
          customerName: 'Adolf Reichel',
          email: 'Adolf.Reichel@hotmail.com',
          shopName: 'Turo Park',
          appointment: '2022-11-19T09:00:00.000Z',
          appointmentFinish: '2022-11-19T10:00:00.000Z',
        });
      });
      test('Put: updating a booking should return status code 203', async () => {
        const { status, body } = await request.put('/bookings/1').send({
          customerName: 'newCustomer',
          email: 'newCustomer@email.com',
          appointment: '2022-12-19T09:00:00.000Z',
        });

        const { updatedAt, createdAt, ...booking } = body.booking;

        expect(status).toBe(203);
        expect(booking).toEqual({
          id: 1,
          shopId: 1,
          serviceId: 10,
          customerId: 106,
          appointment: '2022-12-19T09:00:00.000Z',
          time: '9:00',
          appointmentFinish: '2022-12-19T10:00:00.000Z',
        });
      });
      test('Delete: deleting a booking should return status code 204', async () => {
        const { status } = await request.delete('/bookings/1');
        const { body } = await request.get('/bookings/1');
        const { booking } = body;

        expect(status).toBe(204);
        expect(booking).toEqual([]);
      });
    });
    describe('/bookings/:id errors', () => {
      test('Updating a booking with customerName with numbers should return status code 400', async () => {
        const { status, body } = await request.put('/bookings/10').send({
          customerName: 11111,
          email: 'emailChanged@email.com',
          appointment: '2022-12-19T14:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Updating a booking with  an invalid email should return status code 400', async () => {
        const { status, body } = await request.put('/bookings/10').send({
          customerName: 'Jake Wills',
          email: 'notEmail.com',
          appointment: '2022-12-19T14:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Email validation failed.');
      });
      test('Updating a booking with an invalid appointment (number) should return status code 400', async () => {
        const { status, body } = await request.put('/bookings/10').send({
          customerName: 'Jake Wills',
          email: 'notEmail.com',
          appointment: 11111,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: appointment cannot be a number');
      });
      test('Updating a booking with an invalid appointment  (not a date) should return status code 400', async () => {
        const { status, body } = await request.put('/bookings/10').send({
          customerName: 'Jake Wills',
          email: 'email@am.com',
          appointment: '2022-12-42T14:00:00.000Z',
        });
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Appointment is not a date');
      });
      test('Updating a booking with an invalid customerName length  should return status code 400', async () => {
        const { status, body } = await request.put('/bookings/10').send({
          customerName: 'fj',
          email: 'email@am.com',
          appointment: '2022-12-12T14:00:00.000Z',
        });
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: CustomerName minimum length failed.');
      });
    });
    describe('/bookings/available', () => {
      test('Get: getAllAvailableBookings should return an array of times available with status code 200 (day with no bookings)', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/11/2022&shopName=Palma&serviceName=Customizable next generation alliance'
        );

        const { bookings } = body;
        expect(status).toBe(200);
        expect(bookings).toEqual([
          '2022-11-19T12:00:00.000Z',
          '2022-11-19T16:00:00.000Z',
          '2022-11-19T17:00:00.000Z',
        ]);

        const firstBooking = await request.post('/bookings').send({
          customerName: 'Jay dee',
          email: 'jdoe@yao.com',
          serviceName: 'Reverse-engineered mission-critical encryption',
          shopName: 'Palma',
          appointment: bookings[0],
        });
        const secondBooking = await request.post('/bookings').send({
          customerName: 'Jay dee',
          email: 'jdoe@yao.com',
          serviceName: 'Reverse-engineered mission-critical encryption',
          shopName: 'Palma',
          appointment: bookings[1],
        });
        const thirdBooking = await request.post('/bookings').send({
          customerName: 'Jay dee',
          email: 'jdoe@yao.com',
          serviceName: 'Reverse-engineered mission-critical encryption',
          shopName: 'Palma',
          appointment: bookings[2],
        });

        expect(firstBooking.status).toBe(201);
        expect(secondBooking.status).toBe(201);
        expect(thirdBooking.status).toBe(201);
      });
      test('Get: getAllAvailableBookings should return an array of times available with status code 200', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/12/2022&shopName=Palma&serviceName=Customizable next generation alliance'
        );

        const { bookings } = body;
        expect(status).toBe(200);
        expect(bookings).toEqual([
          '2022-12-19T09:00:00.000Z',
          '2022-12-19T10:00:00.000Z',
          '2022-12-19T11:00:00.000Z',
          '2022-12-19T12:00:00.000Z',
          '2022-12-19T13:00:00.000Z',
          '2022-12-19T14:00:00.000Z',
          '2022-12-19T15:00:00.000Z',
          '2022-12-19T16:00:00.000Z',
          '2022-12-19T17:00:00.000Z',
          '2022-12-19T18:00:00.000Z',
          '2022-12-19T19:00:00.000Z',
        ]);
      });
      test('Get: getAllAvailableBookings should return an empty array of times available with status code 200 for a service that not exists', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/12/2022&shopName=palma&serviceName=NOTASERVICE'
        );
        expect(status).toBe(200);
        expect(body).toEqual({ bookings: [] });
      });
      test('Get: getAllAvailableBookings should return an empty array of times available with status code 200 for a shop that not exists', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/12/2022&shopName=notAShop&serviceName=Customizable next generation alliance'
        );
        expect(status).toBe(200);
        expect(body).toEqual({ bookings: [] });
      });
    });
    describe('/bookings/available Errors', () => {
      test('should return status code 400 to missing query field validation error', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/11/2022&serviceName=Customizable next generation alliance'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: missing field: shopName');
      });
      test('should return status code 400 to missing query field validation error on date', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=19/11/YEAR&shopName=Palma&serviceName=Customizable next generation alliance'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid Date');
      });
      test('should return status code 400 to missing query field validation error on date day', async () => {
        const { status, body } = await request.get(
          '/bookings/available?date=day/11/2026&shopName=Palma&serviceName=Customizable next generation alliance'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid Date');
      });
    });
  });
});
