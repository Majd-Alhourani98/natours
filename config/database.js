const mongoose = require('mongoose');
const buildDatabaseURL = require('../utils/buildDatabaseURL');

// Localhost MongoDB connection
// const DB_URI = 'mongodb://127.0.0.1:27017/natours';

// Atlas Connection

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_URL } = process.env;
DB_URI = buildDatabaseURL(DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`\n${'━'.repeat(20)} 🔥 DATABASE ${'━'.repeat(20)}`);
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
