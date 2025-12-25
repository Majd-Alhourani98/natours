const mongoose = require('mongoose');
const buildDatabaseURI = require('../utils/buildDatabaseURI');

const DB_URI = 'mongodb://localhost:27017/natours';

// const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
// const DB_URI = buildDatabaseURI(
//   DATABASE_USERNAME,
//   DATABASE_PASSWORD,
//   DATABASE_USERNAME,
//   DATABASE_URL
// );

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`${'━'.repeat(20)} ⚡ DATABASE ${'━'.repeat(20)}`);
    console.log(`🟢 STATUS   → Connected`);
    console.log(`📦 DATABASE → ${mongoose.connection.name}`);
    console.log(`🌐 HOST     → ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`\n${'━'.repeat(20)} ⚠️  DATABASE ${'━'.repeat(20)}`);
    console.error('🛑 MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
