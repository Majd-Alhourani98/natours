// ============================
// Environment Configuration
// ============================
// Centralized configuration loader with validation and immutability
// Designed for production-grade reliability and DX (Developer Experience)

const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

// -------------------------------------------------
// 1️⃣ Load environment file based on NODE_ENV
// -------------------------------------------------
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = path.resolve(__dirname, '..', `.env.${NODE_ENV}`);

dotenv.config({ path: envFile });

// Optional sanity check: ensure file exists in non-production environments
if (NODE_ENV !== 'production') {
  console.info(`📦 Loaded environment file: ${envFile}`);
}

// -------------------------------------------------
// 2️⃣ Define validation schema for environment vars
// -------------------------------------------------
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .label('NODE_ENV')
    .default('development'),
  PORT: Joi.number().port().default(3000).label('PORT'),

  DATABASE_URL: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\/.+$/) // custom pattern for Mongo URIs
    .required()
    .label('DATABASE_URL'),
  DATABASE_USERNAME: Joi.string().trim().min(3).required().label('DATABASE_USERNAME'),
  DATABASE_PASSWORD: Joi.string().trim().min(6).required().label('DATABASE_PASSWORD'),

  JWT_SECRET: Joi.string().min(32).required().label('JWT_SECRET'),
  JWT_EXPIRES_IN: Joi.string().default('1d').label('JWT_EXPIRES_IN'),
  JWT_COOKIE_EXPIRES_IN: Joi.number()
    .integer()
    .valid(90) // exactly 90 days
    .required(),

  EMAIL_HOST: Joi.string().required().hostname().label('EMAIL_HOST'),
  EMAIL_PORT: Joi.number()
    .valid(25, 465, 587, 2525) // restrict to known SMTP ports
    .required()
    .label('EMAIL_PORT'),
  EMAIL_USERNAME: Joi.string().required().label('EMAIL_USERNAME'),
  EMAIL_PASSWORD: Joi.string().min(8).required().label('EMAIL_PASSWORD'),
})
  .unknown(false)
  .prefs({ errors: { label: 'key' } });

// -------------------------------------------------
// 3️⃣ Extract raw env vars for validation
// -------------------------------------------------
const envRaw = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
};

// -------------------------------------------------
// 4️⃣ Validate and handle errors gracefully
// -------------------------------------------------
const { error, value: envVars } = envSchema.validate(envRaw, {
  abortEarly: false,
  stripUnknown: true,
});

if (error) {
  console.error('❌ Invalid environment configuration:');
  error.details.forEach(d => console.error(`  • ${d.message}`));
  process.exit(1); // Exit gracefully to avoid undefined behavior
}

// -------------------------------------------------
// 5️⃣ Construct and freeze the config object
// -------------------------------------------------
const CONFIG = Object.freeze({
  SERVER: Object.freeze({
    NODE_ENV: envVars.NODE_ENV,
    PORT: envVars.PORT,
  }),

  DATABASE: Object.freeze({
    URL: envVars.DATABASE_URL,
    PASSWORD: envVars.DATABASE_PASSWORD,
    USERNAME: envVars.DATABASE_USERNAME,
  }),

  JWT: Object.freeze({
    SECRET: envVars.JWT_SECRET,
    EXPIRES_IN: envVars.JWT_EXPIRES_IN,
    JWT_COOKIE_EXPIRES_IN: envVars.JWT_COOKIE_EXPIRES_IN,
  }),

  FLAGS: Object.freeze({
    isDevelopment: envVars.NODE_ENV === 'development',
    isProduction: envVars.NODE_ENV === 'production',
    isTest: envVars.NODE_ENV === 'test',
  }),

  BASE_URL: Object.freeze(
    envVars.NODE_ENV === 'production' ? 'https://myapp.com' : `http://localhost:${envVars.PORT}`
  ),

  EMAIL: {
    HOST: envVars.EMAIL_HOST,
    PORT: envVars.EMAIL_PORT,
    USERNAME: envVars.EMAIL_USERNAME,
    PASSWORD: envVars.EMAIL_PASSWORD,
  },
});

// -------------------------------------------------
// 6️⃣ Export immutable configuration
// -------------------------------------------------
module.exports = CONFIG;
