const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, '..', `.env.${env}`) });

module.exports = Object.freeze({
  SERVER: Object.freeze({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
  }),

  DATABASE: Object.freeze({
    URL: process.env.DATABASE_URL,
  }),

  JWT: Object.freeze({
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  }),

  FLAGS: Object.freeze({
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  }),

  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://myapp.com'
      : `http://localhost:${process.env.PORT}`,
});
