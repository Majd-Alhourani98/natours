const mongoose = require('mongoose');
const { buildDatabaseURL } = require('../utils/buildDatabaseURL');

// const DB_URL = 'mongodb://localhost:27017/natours';

const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
const DB_URL = buildDatabaseURL(DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection error:', err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
