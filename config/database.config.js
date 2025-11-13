const mongoose = require('mongoose');
const env = require('./env.config.js');

async function connectDB() {
  const { URL, USERNAME, PASSWORD } = env.DATABASE;
  const DATABASE_URI = URL.replace('<USERNAME>', USERNAME).replace('<PASSWORD>', PASSWORD);

  try {
    const conn = await mongoose.connect(DATABASE_URI);

    console.log(`✅ MongoDB Connected`);

    // Only show in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️  DB: ${conn.connection.name}`);
    }

    // Runtime event monitoring
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed (SIGINT)');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed (SIGTERM)');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);

    if (error.message.includes('authentication')) console.error('💡 Check DB username/password');

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED'))
      console.error('💡 Check that the DB server/cluster is running');

    process.exit(1);
  }
}

module.exports = connectDB;
