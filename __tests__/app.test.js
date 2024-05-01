process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const app = require('../src/app');
const db = require('../src/models/index');
const request = supertest(app);
const { set, addDays, addMinutes, format } = require('date-fns');
const getRandom = require('./utils/getRandom');
const getTime = require('./utils/getTime');
const getRandomDate = require('./utils/getRandomDate');

const TODAY = new Date();
const TOMORROW = addDays(TODAY, 1);
const todayUKFormat = format(TODAY, 'dd/MM/YYY');
let service;

describe('Test search feature', () => {
  beforeAll(async () => {
    await db.Customer.sync({ alter: true });
    service = await getRandom(request, '/api/services');
  });
  afterAll(async () => {
    await db.sequelize.close();
  });

  describe('Testing initial connection and route not found', () => {
    test('should return status code 200', async () => {
      const { status, body } = await request.get('/api');
      const { msg } = body;
      expect(status).toBe(200);
      expect(msg).toBe('Ok');
    });
    test('Should return status code 404 for route that does not exist', async () => {
      const { status, body } = await request.get('/api/notFound');
      const { msg } = body;
      expect(status).toBe(404);
      expect(msg).toBe('Route not found');
    });
    test('Should return status code 404 for route that does not exist on api route', async () => {
      const { status, body } = await request.get('/api/api/notFound');
      const { msg } = body;
      expect(status).toBe(404);
      expect(msg).toBe('Route not found');
    });
    test('Should return status code 400 for query field that does not exist', async () => {
      const { status, body } = await request.get('/api/customers?foo=sa');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: Query field does not exist');
    });
    test('Should return status code 400 for wrong date format(string)', async () => {
      const { status, body } = await request.get(
        '/api/customers?createdAt=notADate'
      );
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: createdAt is not a date');
    });
    test('Should return status code 400 for wrong date format(number)', async () => {
      const { status, body } = await request.get('/api/customers?createdAt=23');
      const { msg } = body;
      expect(status).toBe(400);
      expect(msg).toBe('Bad request: createdAt cannot be a number');
    });
  });

  // Test suite for testing the CUSTOMERS ROUTES

  describe('Customers routes,', () => {
    describe('/api/customers', () => {
      test('Get: getAllCustomers should return status code 200', async () => {
        const { status, body } = await request.get('/api/customers');
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(15);
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
          '/api/customers?offset=10&limit=5'
        );
        const { customers } = body;

        expect(status).toBe(200);
        expect(customers).toHaveLength(5);
      });
      test('Get: getAllCustomers Query(orderBy customerName order DESC ) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/api/customers?orderBy=customerName&order=desc'
        );

        const { customers } = body;
        const sortByDescCustomerName = (a, b) => {
          const nameA = a.customerName.toUpperCase();
          const nameB = b.customerName.toUpperCase();

          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return a.customerName - b.customerName;
        };
        const customersCopy = customers.map((c) => c);

        const customersSoterdCopy = customersCopy.sort(sortByDescCustomerName);

        expect(status).toBe(200);
        expect(customers).toHaveLength(15);

        expect(customers).toEqual(customersSoterdCopy);
      });
      test('Get: getAllCustomers Query(get the names which contains Dennis ) should return status code 200', async () => {
        const { body } = await request.get('/api/customers');
        const maxIndex = body.customers.length - 1;
        const randomIndex = Math.floor(Math.random() * maxIndex + 1);
        const customerRandomName = body.customers[randomIndex].customerName;

        const response = await request.get(
          `/api/customers?customerName=${customerRandomName}`


        );
        const { customers } = response.body;

        expect(response.status).toBe(200);
        expect(customers).toHaveLength(1);
        expect(customers[0].customerName).toBe(customerRandomName);

      });

      test('Post: should return status code 201', async () => {
        const { body, status } = await request
          .post('/api/customers')
          .send({ customerName: 'Javier Roca', email: 'Javier_R@example.com' });
        const { customer } = body;

        expect(status).toBe(201);
        expect(customer.id).toBe(16);
        expect(customer.customerName).toBe('Javier Roca');
        expect(customer.email).toBe('Javier_R@example.com');
      });
    });
    describe('/api/customers Errors', () => {
      test('should return status code 400 to unique email validation error', async () => {
        const { body, status } = await request.post('/api/customers').send({
          customerName: ' Francisco Javier Roca',
          email: 'Javier_R@example.com',
        });
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Unique constrain error');
      });
      test('should return status code 400 to minimum length validation error', async () => {
        const { body, status } = await request
          .post('/api/customers')
          .send({ customerName: 'Jav', email: 'Jav@example.com' });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation len on customerName failed');
      });
      test('should return status code 400:wrong email format', async () => {
        const { body, status } = await request
          .post('/api/customers')
          .send({ customerName: 'John Doe', email: 'Jondoe_yahoo.com' });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Validation isEmail on email failed');
      });
      test('should return status code 400:query field that does not exist should return status code 400', async () => {
        const { status, body } = await request.get(
          '/api/customers?I_do_not_Exist=Dennis'
        );
        const { msg } = body;

        expect(status).toBe(400);

        expect(msg).toBe('Bad request: Query field does not exist');
      });
    });

    describe('/api/customers/:id', () => {
      test('get: should return status code 200', async () => {
        const { status, body } = await request.get('/api/customers/15');

        const { id, customerName } = body.customer;

        expect(status).toBe(200);
        expect(id).toBe(15);
        expect(body.customer).toHaveProperty('reservations');
      });

      test('Delete: deleting a customer should return status code 204', async () => {
        
        const response = await request.delete('/api/customers/2');
        if (response) {
          const { body } = await request.get('/api/customers/2');
          const { customer } = body;


          expect(customer).toBe(null);
          expect(response.status).toBe(204);
        }
      });

      test('Put: updating a customer should return status code 200', async () => {
        const { status, body } = await request.put('/api/customers/10').send({
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
    describe('/api/customers/:id Errors', () => {
      test('Updating a customer with customerName with numbers should return status code 400', async () => {
        const { status, body } = await request.put('/api/customers/10').send({
          customerName: 11111,
          email: 'emailChanged@email.com',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Updating a customer with not valid email should return status code 400', async () => {
        const { status, body } = await request.put('/api/customers/10').send({
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
    describe('/api/services', () => {
      test('Get: getAllServices should return status code 200', async () => {
        const { status, body } = await request.get('/api/services');
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
        const response = await request.get('/api/services');
        const maxIndex = response.body.services.length - 1;
        const randomIndex = Math.floor(Math.random() * maxIndex + 1);
        const randomService = response.body.services[randomIndex];
        const { status, body } = await request.get(
          `/api/services?serviceName=${randomService.serviceName}`
        );
        const { services } = body;
        const service = services[0];

        expect(status).toBe(200);
        expect(service).toEqual(randomService);

      });
      test('Get: getAllServices Query(type and duration) should return status code 200', async () => {
        const { status, body } = await request.get(
          '/api/services?type=facial&duration=30'
        );
        const { services } = body;

        if (services.length > 0) {
          expect(status).toBe(200);
          services.forEach((service) => {
            expect(service.duration).toBe(30);
            expect(service.type).toBe('Facial');
          });
        } else {
          expect(status).toBe(200);
          expect(services).toHaveLength(0);
        }

      });
      test('Post: should return status code 201', async () => {
        const { body, status } = await request.post('/api/services').send({
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
      });
    });
    describe('/api/services Errors', () => {
      test('should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get(
          '/api/services?iDoNotExist=Hello'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('should return status code 400 for query(duration) an invalid input type', async () => {
        const { status, body } = await request.get(
          '/api/services?duration=NAN'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type on parameters');
      });
      test('should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get(
          '/api/services?createdAt=111'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: createdAt cannot be a number');
      });
      test('should return status code 400 for query(createdAt) an invalid input type string', async () => {
        const { status, body } = await request.get(
          '/api/services?createdAt=string'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: createdAt is not a date');
      });
      test('should return status code 400 to unique serviceName validation error', async () => {
        const { body, status } = await request.post('/api/services').send({
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
        const { body, status } = await request.post('/api/services').send({
          serviceName: 'sho',
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe(
          'Bad request: Validation on serviceName min:4, max:20'
        );
      });

      test('should return status code 400 to maximum length validation error', async () => {
        const { body, status } = await request.post('/api/services').send({
          serviceName:
            'longggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe(
          'Bad request: Validation on serviceName min:4, max:20'
        );
      });
      test('should return status code 400 to missing field in the  req body', async () => {
        const { body, status } = await request.post('/api/services').send({
          duration: 45,
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Service.serviceName cannot be null');
      });
      test('should return status code 400 to invalid input (duration)', async () => {
        const { body, status } = await request.post('/api/services').send({
          serviceName: 'Fantastic java',
          duration: 'ten',
          price: 50,
          type: 'Facial',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type on parameters');
      });
      test('should return status code 400 to invalid input (type)', async () => {
        const { body, status } = await request.post('/api/services').send({
          serviceName: 'Fantastic java',
          duration: 'ten',
          price: 50,
          type: 'NOT A VALID TYPE',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe(
          'Bad request: Invalid input on type, available options: Facial, Body, Manicure and pedicure or Laser'
        );
      });
    });
    describe('/api/services:id', () => {
      test('Get: getService should return status code 200', async () => {
        const { status, body } = await request.get('/api/services/1');

        const { id, serviceName, duration, price, type, updatedAt, createdAt } =
          body.service;

        expect(status).toBe(200);
        expect(id).toBe(1);
        expect(typeof serviceName).toBe('string');
        expect(typeof duration).toBe('number');
        expect(typeof price).toBe('number');
        expect(typeof type).toBe('string');

        expect(new Date(updatedAt)).toBeInstanceOf(Date);
        expect(new Date(createdAt)).toBeInstanceOf(Date);
      });
      test('Delete: deleting a service should return status code 204', async () => {
        const { status } = await request.delete('/api/services/11');
        const { body } = await request.get('/api/services/11');
        const { service } = body;

        expect(service).toBe(null);
        expect(status).toBe(204);
      });

      test('Delete: deleting a service that does not exist should return status code 204', async () => {
        const { status } = await request.delete('/api/services/1111');
        const { body } = await request.get('/api/services/1111');

        const { service } = body;

        expect(service).toBe(null);
        expect(status).toBe(204);
      });
      test('Put: updating a service should return status code 203', async () => {
        const { status, body } = await request.put('/api/services/1').send({
          serviceName: 'Updated Service',
          type: 'Facial',
          price: 100,
          duration: 120,
        });

        const { updatedAt, createdAt, ...service } = body.service;

        expect(status).toBe(203);
        expect(service).toEqual({
          id: 1,
          serviceName: 'Updated Service',
          duration: 120,
          price: 100,
          type: 'Facial',
        });
      });
    });
    describe('/api/services:id Errors', () => {
      test('Should return status code 400 for an invalid ID field that does not exist', async () => {
        const { status, body } = await request.get('/api/services/NotID');

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: id has to be a number');
      });

      test('Should return status code 400 for an invalid ID that does not exist should return status code 204', async () => {
        const { status, body } = await request.delete('/api/services/NotID');

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: id has to be a number');
      });
      test('Updating a service with a non valid input type(price) should return status code 400', async () => {
        const { status, body } = await request.put('/api/services/1').send({
          serviceName: 'Updated Service',
          type: 'Facial',
          price: 'hundred',
          duration: 120,
          status: false,
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type on parameters');
      });
      test('Updating a service with a non valid input  minimum length (serviceName) type(price) should return status code 400', async () => {
        const { status, body } = await request.put('/api/services/1').send({
          serviceName: 'sho',
          type: 'Facial',
          price: 22,
          duration: 120,
          status: false,
        });

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe(
          'Bad request: Validation on serviceName min:4, max:20'
        );
      });
    });
  });

  // Test suite for testing the SHOPS ROUTES

  describe('Shops routes', () => {
    describe('/api/shops', () => {
      test('Get: getAllShops should return status code 200', async () => {
        const { status, body } = await request.get('/api/shops');
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
        const { status, body } = await request.get(
          '/api/shops?shopName=Turo park'
        );

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
    describe('/api/shops Errors', () => {
      test('Should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get(
          '/api/shops?iDoNotExist=Hello'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('Should return status code 400 for query(id) an invalid input type', async () => {
        const { status, body } = await request.get('/api/shops?id=NAN');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type on parameters');
      });
      test('Should return status code 400 for query(createdAt) an invalid input type number', async () => {
        const { status, body } = await request.get('/api/shops?createdAt=111');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: createdAt cannot be a number');
      });
      test('Should return status code 400 for query(updatedAt) an invalid input type string', async () => {
        const { status, body } = await request.get(
          '/api/shops?updatedAt=string'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: updatedAt is not a date');
      });
    });
  });

  // Test suite for testing the BOOKINGS ROUTE

  describe('Bookings routes', () => {
    describe('/api/bookings', () => {
      test('Get: getAllBookings should return status code 200', async () => {
        const { status, body } = await request.get('/api/bookings');
        const { bookings } = body;
        expect(status).toBe(200);
        expect(bookings).toHaveLength(6);
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
          '/api/bookings?orderBy=appointment&order=asc'
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
        const booking = await request.get('/api/bookings/1');
        const { appointment, appointmentFinish, shopName } =
          booking.body.booking;

        const { status, body } = await request.get(
          `/api/bookings?appointmentFrom=${appointment}&appointmentTo=${appointmentFinish}&shopName=${shopName}`
        );
        const { id } = body.bookings[0];

        expect(status).toBe(200);
        expect(id).toBe(booking.body.booking.id);
      });

      test('Post: should return status code 201 (not case sensitive) with an existing user', async () => {
        const appointment = set(TOMORROW, {
          hours: 15,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });
        const appointmentFinish = addMinutes(appointment, 30);

        const { body, status } = await request.post('/api/bookings').send({
          customerName: 'amber Sipes',
          email: 'Amber37@hotmail.com',
          serviceName: 'Exclusive grid-enabled Graphical User Interface',
          shopName: 'Palma de Majorca',
          appointment: appointment,
        });

        const { id } = customer.body.customer;

        const { customerName, email, id } = await getRandom(
          request,
          '/api/customers'
        );
        const service = await getRandom(request, '/api/services');

        const appointmentFinish = addMinutes(appointment, service.duration);
        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email,
          serviceName: service.serviceName,
          shopName: 'Palma de Majorca',
          appointment: appointment,
        });

        const time = getTime(appointment);
        const customerId = id;
        const serviceId = service.id;

        const { createdAt, updatedAt, ...restBooking } = body.booking;

        expect(status).toBe(201);
        expect(restBooking).toEqual({

          id: 7,
          customerId,
          serviceId,
          shopId: 3,
          appointment: appointment.toISOString(),
          time,
          appointmentFinish: appointmentFinish.toISOString(),

        });
      });
      
      test('Post: should return status code 201 (not case sensitive) for a new user', async () => {
        const appointment = set(TOMORROW, {
          hours: 10,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });

        const service = await getRandom(request, '/api/services');
        const appointmentFinish = addMinutes(appointment, service.duration);

        const time = getTime(appointment);

        const serviceId = service.id;
        const { body, status } = await request.post('/api/bookings').send({
          customerName: 'New User',
          email: 'newUser@yahoo.com',
          serviceName: service.serviceName,
          shopName: 'Turo park',

          appointment: appointment,
        });

        const { createdAt, updatedAt, ...restBooking } = body.booking;

        expect(status).toBe(201);
        expect(restBooking).toEqual({

          time,
          id: 8,
          serviceId,

          shopId: 1,
          appointment: appointment.toISOString(),
          appointmentFinish: appointmentFinish.toISOString(),
          customerId: 18,
        });
      });
    });

    describe('/api/bookings Errors', () => {
      test('Get: should return status code 400 for wrong date format(string)', async () => {
        const { status, body } = await request.get(
          '/api/bookings?updatedAt=notADate'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: updatedAt is not a date');
      });
      test('Get:should return status code 400 for query field that does not exist', async () => {
        const { status, body } = await request.get(
          '/api/bookings?iDoNotExist=Hello'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Query field does not exist');
      });
      test('Get: should return status code 400 for query value that does not exist', async () => {
        const { status, body } = await request.get(
          '/api/bookings?duration=long'
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid value type on parameters');
      });
      test('Post: should return status code 400 for field(customerName) that cannot be number', async () => {
        const { body, status } = await request.post('/api/bookings').send({
          customerName: 111,
          email: 'newUser@yahoo.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'Palma de Majorca',
          appointment: '2023-09-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: customerName cannot be a number');
      });
      test('Post: should return status code 400 for field(appointment) that cannot be number', async () => {
        const { body, status } = await request.post('/api/bookings').send({
          customerName: 'Javier Roca',
          email: 'fjrocavazquez@gmail.com',
          serviceName: 'Re-contextualized Background info-mediaries',
          shopName: 'Palma de Majorca',
          appointment: 11111,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: appointment cannot be a number');
      });
      test('Post: should return status code 400 for a not valid email', async () => {

        const appointment = getRandomDate();
        const { customerName } = await getRandom(request, '/api/customers');
        const service = await getRandom(request, '/api/services');

        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email: 'im_am_not_an_email.com',
          serviceName: service.serviceName,
          shopName: 'Palma de Majorca',
          appointment: appointment,

        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Email validation failed.');
      });
      test('Post: should return status code 400 for a not valid email(number)', async () => {

        const appointment = getRandomDate();
        const { customerName } = await getRandom(request, '/api/customers');
        const { serviceName } = await getRandom(request, '/api/services');

        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email: 1111,
          serviceName,
          shopName: 'Palma de Majorca',
          appointment,

        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: email cannot be a number');
      });
      test('Post: should return status code 400 for a non existing shop', async () => {

        const appointment = getRandomDate();
        const { customerName, email } = await getRandom(
          request,
          '/api/customers'
        );
        const { serviceName } = await getRandom(request, '/api/services');

        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email,
          serviceName,
          shopName: 'plma',
          appointment,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Shop not exist');
      });
      test('Post: should return status code 400 for a non existing service', async () => {

        const appointment = getRandomDate();
        const { customerName, email } = await getRandom(
          request,
          '/api/customers'
        );

        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email,
          serviceName: 'I am not existing',
          shopName: 'Turo park',
          appointment,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Service not exist');
      });
      test('Post: should return status code 400 for a past date appointment', async () => {

        const { customerName, email } = await getRandom(
          request,
          '/api/customers'
        );
        const { serviceName } = await getRandom(request, '/api/services');

        const { body, status } = await request.post('/api/bookings').send({
          customerName,
          email,
          serviceName,
          shopName: 'Turo park',
          appointment: '2022-01-02T15:00:00.000Z',
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: cannot book a date in the past');
      });
      test('Post: should return status code 400 for an appointment date all ready taken', async () => {
        const appointment = getRandomDate();
        const { serviceName } = await getRandom(request, '/api/services');
        console.log(serviceName);
        await request.post('/api/bookings').send({
          customerName: 'Jonh doe',
          email: 'jdoe@yahoo.com',
          serviceName,
          shopName: 'Turo park',
          appointment,
        });

        const { body, status } = await request.post('/api/bookings').send({
          customerName: 'Jonh doe',
          email: 'jdoe@yahoo.com',
          serviceName,
          shopName: 'Turo park',
          appointment,
        });

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Appointment not available');
      });
    });
    describe('/api/bookings/:id', () => {
      test('Get: getBookingById should return an booking  with status code 200)', async () => {

        const {
          id,
          customerInfo,
          shopInfo,
          appointment,
          appointmentFinish,
          createdAt,
          updatedAt,
        } = await getRandom(request, '/api/bookings');

        const { status, body } = await request.get(`/api/bookings/${id}`);
        const { booking } = body;

        expect(status).toBe(200);
        expect(booking).toEqual({
          id,
          customerName: customerInfo.customerName,
          email: customerInfo.email,
          shopName: shopInfo.shopName,
          appointment,
          appointmentFinish,
          createdAt,
          updatedAt,
        });
      });

      test('Delete: deleting a booking should return status code 204', async () => {
        const { status } = await request.delete('/api/bookings/1');
        const { body } = await request.get('/api/bookings/1');
        const { booking } = body;

        expect(status).toBe(204);
        expect(booking).toEqual([]);
      });
    });
    describe('/api/bookings/:id errors', () => {
      test('get: should return status code 400 for a not valid id param', async () => {
        const { body, status } = await request.get('/api/bookings/notID');
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: id has to be a number');
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
    });
    describe('/api/bookings/available', () => {
      test('Get: getAllAvailableBookings should return an array of times available with status code 200, then post booking for every space available anch checkafter posting the booking there is no spaces left', async () => {
        const palmaBookingsResponse = await request.get(
          '/api/bookings/?shopName=Palma de Majorca'
        );
        const lastbooking = palmaBookingsResponse.body.bookings.pop();
        const date = format(new Date(lastbooking.appointment), 'dd/MM/YYY');

        const serviceName = lastbooking.serviceInfo.serviceName;
        const duration = lastbooking.serviceInfo.duration;
        const appointment = lastbooking.appointment;

        const { status, body } = await request.get(
          `/api/bookings/available?date=${date}&shopName=Palma de Majorca&serviceName=${serviceName}`
        );

        const { availableBookings } = body.bookings;

        const { bookings } = body;
        expect(status).toBe(200);
        expect(
          availableBookings.filter((booking) => booking !== appointment)
        ).toEqual(availableBookings);

        // Posting booking for all spaces for bookings available.

        await Promise.all(
          availableBookings.map(
            async (bookingAvailable, index) =>
              await request.post('/api/bookings').send({
                customerName: 'Jonh Doe',
                email: 'jdoe@example.com',
                serviceName,
                shopName: 'Palma de Majorca',
                appointment: bookingAvailable,
              })
          )
        );
        // Test  that ther no more spaces left to make a booking
        const {
          body: { bookings },
        } = await request.get(
          `/api/bookings/available?date=${date}&shopName=Palma de Majorca&serviceName=${serviceName}`
        );

        expect(bookings.availableBookings).toHaveLength(0);

      });
    });
    describe('/api/bookings/available Errors', () => {
      test('Should return status code 400 to missing query field validation error', async () => {
        const { status, body } = await request.get(

          `/api/bookings/available?date=${todayUKFormat}&serviceName=${service.serviceName}`

        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: missing field: shopName');
      });
      test('Should return status code 400 to a not valid date field validation error', async () => {
        const { status, body } = await request.get(
          `/api/bookings/available?date=${'NOT A DATE'}&serviceName=${
            service.serviceName
          }&shopName=Turo Park`
        );
        console.log({ body });
=
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
      });
      test('Should return status code 400 to a shop that does not exist query field validation error', async () => {
        const { status, body } = await request.get(
          `/api/bookings/available?date=${todayUKFormat}&serviceName=${
            service.serviceName
          }&shopName=${'NOT A SHOP NAME'}`

        );

        const { msg } = body;

        expect(status).toBe(400);
        expect(msg).toBe('Bad request: shop does not exist');

      });
      test('Should return status code 400 to a service that does not exist query field validation error', async () => {
        const { status, body } = await request.get(
          `/api/bookings/available?date=${todayUKFormat}&serviceName=${'NOT A SERVICE'}&shopName=Turo Park`
        );
        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: missing field: shopName');

      });
      test('should return status code 400 to missing query field validation error on date', async () => {
        const { status, body } = await request.get(
          `/api/bookings/available?date=${'NOT A DATE'}&serviceName=${
            service.serviceName
          }&shopName=Turo Park`

        );

        const { msg } = body;
        expect(status).toBe(400);
        expect(msg).toBe('Bad request: Invalid date');
      });
    });
  });
});
