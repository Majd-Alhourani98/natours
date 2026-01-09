const mongoose = require('mongoose');

// Localhost MongoDB connection
// const DB_URI = 'mongodb://127.0.0.1:27017/natours';

// Atlas Connection
DB_URI = process.env.DATABASE_URL.replace('<USERNAME>', process.env.DATABASE_USERNAME)
  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

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
