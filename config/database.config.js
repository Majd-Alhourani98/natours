// ======================================================================
// 1️⃣  IMPORTS & CONFIGURATION
// ======================================================================

const mongoose = require('mongoose'); // Mongoose ODM for MongoDB
const env = require('./env.config.js'); // Environment variables and flags

// ======================================================================
// 2️⃣  GLOBAL EVENT LISTENERS (attach once)
// ======================================================================

// Log runtime errors from the MongoDB connection
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB runtime error:', err.message);
});

// Warn when MongoDB connection is lost
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

// Log when MongoDB reconnects
mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// ======================================================================
// 2a️⃣  HANDLE MONGOOSE ERRORS
// ======================================================================

/**
 * Handle various MongoDB connection and runtime errors.
 * Provides friendly tips for authentication, network, SSL, and Atlas-specific errors.
 */
function handleMongoError(error) {
  console.error('❌ MongoDB Connection Error:', error.message);

  // AUTHENTICATION ERRORS
  if (error.message.includes('authentication') || error.message.includes('Authentication failed')) {
    console.error('💡 Tip: Check DB username/password');
    console.error('💡 Ensure user has proper database permissions');
  }

  // NETWORK ERRORS
  if (error.message.includes('ENOTFOUND'))
    console.error('💡 Tip: DNS resolution failed - check your connection string');
  if (error.message.includes('ECONNREFUSED'))
    console.error('💡 Tip: Connection refused - database server may be down');
  if (error.message.includes('ETIMEDOUT') || error.message.includes('connection timed out'))
    console.error('💡 Tip: Connection timeout - check network/firewall');
  if (error.message.includes('ECONNRESET'))
    console.error('💡 Tip: Connection reset - network unstable or server restart');

  // MONGODB-SPECIFIC ERRORS
  if (error.message.includes('MongoServerSelectionError'))
    console.error('💡 Tip: Cannot connect to any MongoDB server');
  if (error.message.includes('bad auth')) console.error('💡 Tip: Username or password incorrect');
  if (error.message.includes('not authorized'))
    console.error('💡 Tip: User lacks permissions for this database');
  if (error.message.includes('querySrv ENOTFOUND'))
    console.error('💡 Tip: SRV record not found - check connection string format');

  // SSL/TLS ERRORS
  if (error.message.includes('SSL') || error.message.includes('certificate'))
    console.error('💡 Tip: SSL/TLS certificate error');

  // DATABASE/COLLECTION ERRORS
  if (error.message.includes('database does not exist'))
    console.error('💡 Tip: Database will be created on first write operation');
  if (error.message.includes('no suitable servers found'))
    console.error('💡 Tip: No matching MongoDB servers found');

  // CONFIGURATION ERRORS
  if (error.message.includes('Invalid connection string'))
    console.error('💡 Tip: Malformed MongoDB URI');
  if (error.message.includes('topology was destroyed'))
    console.error('💡 Tip: Connection pool closed - app may be shutting down');

  // ATLAS-SPECIFIC ERRORS
  if (error.message.includes('IP') && error.message.includes('not in whitelist'))
    console.error('💡 Tip: Your IP is not whitelisted in MongoDB Atlas');
  if (error.message.includes('cluster is paused'))
    console.error('💡 Tip: MongoDB Atlas cluster is paused');

  // DEVELOPMENT FULL DETAILS
  if (env.FLAGS.isDevelopment) {
    console.error('📋 Full error details:', error);
  }
}

// ======================================================================
// 3️⃣  MONGODB CONNECTION FUNCTION
// ======================================================================

/**
 * Connects to MongoDB using Mongoose.
 * Handles already connected state, logs connection details, and sets up graceful shutdown.
 */
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  const { URL, USERNAME, PASSWORD } = env.DATABASE;
  const DATABASE_URI = URL.replace('<USERNAME>', encodeURIComponent(USERNAME)).replace(
    '<PASSWORD>',
    encodeURIComponent(PASSWORD)
  );

  try {
    const conn = await mongoose.connect(DATABASE_URI);
    console.log('✅ MongoDB connected successfully');

    if (env.FLAGS.isDevelopment) {
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️ DB: ${conn.connection.name}`);
    }

    // Graceful shutdown
    const closeConnection = async signal => {
      console.log(`🔌 MongoDB connection closing (${signal})...`);
      await mongoose.connection.close();
      console.log('🛑 Connection closed, exiting...');
      process.exit(0);
    };

    process.once('SIGINT', () => closeConnection('SIGINT'));
    process.once('SIGTERM', () => closeConnection('SIGTERM'));
  } catch (error) {
    handleMongoError(error);
    process.exit(1);
  }
}

// ======================================================================
// 4️⃣  EXPORT
// ======================================================================

module.exports = connectDB;
