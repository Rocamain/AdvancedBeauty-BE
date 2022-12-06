require('dotenv').config();

console.log({ a: process.env.NODE_ENV });

module.exports = {
  development: {
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
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
    use_env_variable: process.env.DATABASE_URL,
  },
};
