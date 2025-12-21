const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/natours';

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`\n${'━'.repeat(20)} ⚡ DATABASE ${'━'.repeat(20)}`);
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
