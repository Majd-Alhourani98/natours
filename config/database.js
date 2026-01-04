const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/natours';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection failed`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
