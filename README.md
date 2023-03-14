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

Advance Beauty is a back end open api created with Node js and Express, where you do CRUDoperations around a beauty center. Here you can find he docs of the API on production[Test Api](https://advancedbeauty-be-production.up.railway.app/)

### What the project does.

- All sort of crud operations, check the [docs](https://advancedbeauty-be-production.up.railway.app/)
- Send email for order Confirmations and contact enquires.

### Goals

My main goal was to learn and create a full project with all the required needs for a functional beauty center. This back end is part of a major project which includes:

1. [Advanced beauty web](https://advanced-beauty-fe.vercel.app/).
2. [Advanced beauty CMS](https://advancedbeautycms-production.up.railway.app/admin)

Repos:

1- [Front End](https://github.com/Rocamain/AdvancedBeauty_FE)
2- [Strapi/CMS](https://github.com/Rocamain/AdvancedBeauty_CMS)

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
- Migrate and seed data within Suparbase and Railway in production.

##### Future improvements:

- Check how to implement a continuos integration with Github and test.
- Create more friendly responses with some type of errors.
- Add the possibility to send promotions to customers through dynamic emails with Sendgrid
- Implement a route for employees and add the task to each of one of them adding some logic.
- Check the possibility to change Date-fns for a lighter library.
- Check the code to be more DRY.

---

# GET STARTED

If you just want to test the API, you don't need to follow the installation steps. It already on production. [Test Api](https://advancedbeauty-be-production.up.railway.app/)

---

## Install [PostgreSQL](https://www.postgresql.org/download/).

### Mac

- Please note that if you are using a Mac with the M1 chip you will need to install `psql` via your Rosetta terminal as we are installing it globally and the installation will not persist otherwise.

- Install Postgres App https://postgresapp.com/
  - Open the app (little blue elephant) and select initialize/start
- type `psql` into your terminal. You should then see something similar to:

```psql
psql (9.6.5, server 9.6.6)
Type "help" for help.

username=#
```

- if the above does not show/you get an error, run the following commands in your terminal:
  - `brew update`
  - `brew doctor`
  - `brew install postgresql`

### Ubuntu / WSL

**In your linux terminal:**

- Run these commands:
  `sudo apt-get update`

  `sudo apt-get install postgresql postgresql-contrib`

- Next run the following commands to create a database user for Postgres.

  `sudo -u postgres createuser --superuser $USER`

  `sudo -u postgres createdb $USER`

If you see the following error: _`role "username-here" already exists`,_ it means that you already have a Postgres user so can move on to the next step.

If you see the following error: _`Cannot connect to database/server` or similar,_ run `sudo service postgresql start` to ensure that the postgresql server is running before trying the above again.

- Then run this command to enter the terminal application for PostgreSQL:

  `psql`

_You may need to run the following command first to start the PostrgreSQL server in order for the `psql` command to work:_ `sudo service postgresql start`

- Now type:

  `ALTER USER username WITH PASSWORD 'mysecretword123';`

  **BUT** Instead of `username` type your Ubuntu username and instead of `'mysecretword123'` choose your own password and be sure to wrap it in quotation marks. Use a simple password like 'password'. **DONT USE YOUR LOGIN PASSWORD** !

- You can then exit out of psql by typing `\q`

#### Storing a Postgres password on Ubuntu

To set a default password to use when running the psql cli you can create a file called `.pgpass` in your home directory. (If you're using macOS this feature comes out of the box so no need to follow these steps)

**tip:** You can navigate to your home directory from any terminal by running cd with no arguments

```bash
cd
```

Create a file called `.pgpass` and open it with a text editor.

```bash
touch .pgpass
```

```bash
code .pgpass
```

The file will be empty when first created, and you should then add a single line with the following format:

```
hostname:port:database:username:password
```

Each field can be a literal value or a wildcard: `*`. We just want to set a password so should add the following to your file (replacing 'mypassword' with your actual password that you created when you ran the `ALTER USER` command):

```
*:*:*:*:mypassword
```

The permissions on `.pgpass` must disallow any access to world or group; You can do this with the following command when you are in the directory containing your `.pgpass` file.

```bash
chmod 0600 .pgpass
```

When you run psql it should now use this password as a default so you don't have to provide one on every command.

## Postgresql installed.

create your data base and connect it. If it is not connected, run on the terminal:

```
sudo psql

CREATE DATABASE database_name;
GRANT ALL PRIVILEGES ON DATABASE "database_name" to my_username;

```

## Add the into your .env file.

Test environment

```
TEST_USER: my_username,
TEST_PASSWORD: my_password
TEST_PASSWORD: database_name
TEST_HOST: 127.0.0.1
TEST_PORT: 5432.
```

Repeat the steps 2.2 to 2.4 to add the DEV environment. you have the env.example for your reference.

## Run Scripts.

install packages: yarn install or npm install

install sequelize cli

globally

```
npm install -g sequelize-cli
```

local

```
npm install sequelize-cli
```

### test environment

create database, migrate and seed.

```
npm run db-test:reset
```

run it:

```
npm run dev
```

### development or production environment

create data

```
npm run fetch-dev-data
```

create database, migrate and seed

```
db-development:reset

or

db-production:reset
```

start

```
npm run build-dev

or

npm run build-prod

```

---

# Let's keep in touch

- [LinkedIn](https://www.linkedin.com/in/francisco-javier-roca-vazquez/)
- [CV](https://drive.google.com/file/d/1go0sBfp5Y8yimuth0Ya4xrYH68os-Ew7/view?usp=share_link)
- [Porfolio](https://portfolio-javi-roca-git-main-rocamain.vercel.app/)

---

```

```
