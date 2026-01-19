const mongoose = require('mongoose');
const buildDatabaseURL = require('../utils/buildDatabaseURL');

const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_URL } = process.env;

let DB_URI;

if (process.env.NODE_ENV === 'development') {
  DB_URI = 'mongodb://localhost:27017/natours';
} else {
  DB_URI = buildDatabaseURL(DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_URL);
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`\n${'━'.repeat(20)} 💾 DATABASE ${'━'.repeat(20)}`);
    console.log(`🟢 STATUS      → Connected`);
    console.log(`📦 Database:   → ${mongoose.connection.name}`);
    console.log(`🌐 Host        → ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
