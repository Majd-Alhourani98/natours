const mongoose = require('mongoose');

// const DB_URL = 'mongodb://localhost:27017/natours';

const DB_URL = process.env.DATABASE_URL.replace('<USERNAME>', process.env.DATABASE_USERNAME)
  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

console.log(DB_URL);
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
