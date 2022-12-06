require('dotenv').config();

module.exports = {
  development: {
    DB_URL: process.env.DB_URL,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false,
    },
  },
  test: {
    username: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_HOST,
    port: process.env.TEST_PORT,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false,
    },
    logging: false,
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  },
  production: {
    username: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false,
    },
    logging: false,
    // pool configuration used to pool database connections
    pool: {
      max: 5,
      idle: 30000,
      acquire: 60000,
    },
  },
};
