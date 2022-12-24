<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://drive.google.com/uc?export=view&id=1_cZi3i1jyU3RiNGGG8weX1lKlht6C_9K">
  <source media="(prefers-color-scheme: light)" srcset="https://drive.google.com/uc?export=view&id=1_cZi3i1jyU3RiNGGG8weX1lKlht6C_9K">
  <img alt="Logo Advantage Beauty in light Mode mode." srcset="https://drive.google.com/uc?export=view&id=1_cZi3i1jyU3RiNGGG8weX1lKlht6C_9K">
</picture>

## Tech

[![Express](https://img.shields.io/badge/Express-4.1.8-black)](https://expressjs.com)
[![Postgres](https://img.shields.io/badge/PG-8.7.3-blue)](https://www.postgresql.org)
[![Sequelize](https://img.shields.io/badge/Sequelize-8.7.3-lightblue)](https://sequelize.org)
[![Swagger-jsdoc](https://img.shields.io/badge/Swagger_jsdoc-6.2.5-green)](https://github.com/Surnet/swagger-jsdoc)
[![Swagger-ui-express](https://img.shields.io/badge/Swagger_ui_express-4.6.0-green)](https://github.com/scottie1984/swagger-ui-express)
[![Sendgrid](https://img.shields.io/badge/@Sendgrid/mail-7.7.0-red)](https://docs.sendgrid.com/for-developers)
[![DateFNS](https://img.shields.io/badge/Date_fns-2.29.2-yellow)](https://date-fns.org/)

# DESCRIPTION

Advance Beauty is a back end open api created with Node js and Express, where you do CRUD operations around a beauty center. I was inspired on inspired on [2U Estetica](https://2uestetica.com/).

### What the back does.

- All sort of crud operations, check the [docs](https://advancedbeauty-be-production.up.railway.app/)
- Send email for order Confirmations and contact enquires.

### Goals

My main goal was to learn and create a full project with all the required needs for a functional beauty center. This back end is part of a major project which includes:

1. [Front End](https://example.com)
2. [Strapi/CMS](https://example.com)

 ##### Personal goals:
 
 - Learn new techs as Sequelize, Date-fns,swagger and Sendgrid.
 - Create a booking system.
 - Implement a friendly documentation for the user
 - Implement a good coverage on test.
 - Implement a good coverage on test Handle errors with express middleware getting  
 - Send confirmation and contact emails.
 

### Challenges

- Start form the scratch a project without knowledge of the most the libraries.
- Create a function to avoid the overlap of a date.
- Decide how what information will send the to get the available bookings, to allow the front end to make the booking in an easy and helpful way.
- Create Template in Sendgrid to send emails.
- Create my own data for testing and development with Faker and use Fn system to store in files.
- Migrate and seed data within Suparbase and Raiway in production.

##### Future  improvements:

- Check how to implement a continuos integration with Github and test.
- Create more friendly responses with some type of errors.
- Add the possibility to send promotions to customers through dynamic emails with Sendgrid
- Implement a route for employees and add the task to each of one of  them adding some logic.
- Check the possibility to change Date-fns for a lighter library.
- Check the code to be more DRY.

# GET STARTED

## Steps:

1. Install [PostgreSQL](https://www.postgresql.org/download/).
2. Once installed type the following commands on your terminal to create User and DataBase and added into the .env file.
    
    2.1 Switch to postgres user:
   
     <code>sudo su postgres </code>
     
    2.2 Enter the the interactive terminal for working with Postgres.
    
      <code>CREATE DATABASE database_name; </code>
      
    2.3 Create user (change my_username and my_password).
    
    <code>CREATE USER my_username WITH PASSWORD 'my_password';</code>
    
    2.4 Grant privileges on database to user.
    
    <code>GRANT ALL PRIVILEGES ON DATABASE "database_name" to my_username; </code>
    
    2.5 Add the into your .env file.
    
    <code>TEST_USER: my_username, TEST_PASSWORD: my_password TEST_PASSWORD: database_name, , TEST_HOST: 127.0.0.1, TEST_PORT: 5432.</code>
    
    2.6 Repeat the steps 2.2 to 2.4 to add the DEV environment.
    
3. Run Scripts.

 3.1 <code>npm install</code> or <code>yarn install</code>.
 
 3.2 The data for the test database is on this repository, but for the development you will need to create it , for that you will need to enter the command <code>npm run fetch-dev-data</code>, we discourage to use <code>npm run fetch-test-data</code> as the test will break.
 
 3.3 Next step is to migrate and seed the data. <code>npm run setup-db:test:migrate</code> or <code>npm run setup-db:development:migrate</code> and  next <code>npm run setup-db:test:push:seed</code> or <code>npm run setup-db:development:push:seed</code>.
 
 3.4 Last step npm <code>npm run start</code> for test and development <code>npm run dev </code>.
 
 # Let's keep in touch
 
 - [LinkedIn](https://example.com)
 - [CV](https://example.com)
 - [Porfolio](https://example.com)
 ---
