// ============================================================
// 1️⃣  IMPORTS & CONFIGURATION
// ============================================================

// Import Mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Import environment variables for DB credentials and URL
const env = require('./env.config.js');

// ============================================================
// 2️⃣  CONNECT TO MONGODB FUNCTION
// ============================================================

async function connectDB() {
  // Extract database URL, username, and password from env
  const { URL, USERNAME, PASSWORD } = env.DATABASE;

  // Replace placeholders in URL with actual credentials
  const DATABASE_URI = URL.replace('<USERNAME>', USERNAME).replace('<PASSWORD>', PASSWORD);

  try {
    // Connect to MongoDB using Mongoose
    const conn = await mongoose.connect(DATABASE_URI);

    console.log(`✅ MongoDB Connected`);

    // ============================================================
    // 2a. DEVELOPMENT INFO (only if not in production)
    // ============================================================
    if (env.FLAGS.isDevelopment) {
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️  DB: ${conn.connection.name}`);
    }

    // ============================================================
    // 2b. RUNTIME EVENT MONITORING
    // ============================================================

    // Detect runtime errors
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB runtime error:', err.message);
    });

    // Detect disconnections
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Detect reconnections
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // ============================================================
    // 2c. GRACEFUL SHUTDOWN HANDLERS
    // ============================================================

    // Handle Ctrl+C or terminal stop
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed (SIGINT)');
      process.exit(0);
    });

    // Handle system termination (e.g., Docker, Heroku)
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed (SIGTERM)');
      process.exit(0);
    });
  } catch (error) {
    // ============================================================
    // 2d. ERROR HANDLING
    // ============================================================

    console.error('❌ MongoDB Connection Error:', error.message);

    // Suggest common fixes
    if (error.message.includes('authentication')) console.error('💡 Check DB username/password');

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED'))
      console.error('💡 Check that the DB server/cluster is running');

    // Exit the process if unable to connect
    process.exit(1);
  }
}

// ============================================================
// 3️⃣  EXPORT
// ============================================================

// Export the function to use in server or other modules
module.exports = connectDB;
