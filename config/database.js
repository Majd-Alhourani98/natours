const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/natours';

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
