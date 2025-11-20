// ======================================================================
// 1️⃣  IMPORTS & CONFIGURATION
// ======================================================================

const mongoose = require('mongoose');
const env = require('./env.config.js');

// ======================================================================
// 1a️⃣  CONSTANTS & CONFIGURATION
// ======================================================================

/**
 * Mongoose connection states.
 * Used to check and handle different connection states.
 *
 * @type {Object}
 * @property {number} DISCONNECTED - Not connected (0)
 * @property {number} CONNECTED - Connected and ready (1)
 * @property {number} CONNECTING - Connection in progress (2)
 * @property {number} DISCONNECTING - Disconnecting (3)
 */
const CONNECTION_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
};

/**
 * Mongoose connection options for production-ready configuration.
 * These options optimize connection pooling, timeouts, and error handling.
 *
 * @type {Object}
 * @property {number} maxPoolSize - Maximum number of connections in the pool (default: 10)
 * @property {number} minPoolSize - Minimum number of connections in the pool (default: 2)
 * @property {number} serverSelectionTimeoutMS - How long to wait for server selection (default: 5000ms)
 * @property {number} socketTimeoutMS - How long to wait for socket operations (default: 45000ms)
 * @property {number} connectTimeoutMS - How long to wait for initial connection (default: 10000ms)
 * @property {boolean} bufferCommands - Disable mongoose buffering (fail fast) (default: false)
 * @property {number} maxIdleTimeMS - Close connections after inactivity (default: 30000ms)
 */
const MONGOOSE_OPTIONS = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 2, // Minimum number of connections in the pool
  serverSelectionTimeoutMS: 5000, // How long to wait for server selection
  socketTimeoutMS: 45000, // How long to wait for socket operations
  connectTimeoutMS: 10000, // How long to wait for initial connection
  bufferCommands: false, // Disable mongoose buffering (fail fast)
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

// Connection state tracking
let connectionPromise = null;
let shutdownHandlersSetup = false;

// ======================================================================
// 2️⃣  GLOBAL EVENT LISTENERS
// ======================================================================
// Global event listeners for MongoDB connection lifecycle events

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  if (mongoose.connection.readyState !== 0) return;
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('connecting', () => {
  console.log('⏳ Connecting to MongoDB...');
});

// ======================================================================
// 3️⃣  UTILITY FUNCTIONS
// ======================================================================

/**
 * Builds the complete database URI by replacing placeholders with credentials.
 * Validates that the URL contains required placeholders and properly encodes credentials.
 *
 * @example
 * // Basic usage
 * const uri = buildDatabaseURI(
 *   'mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/dbname',
 *   'myuser',
 *   'mypassword'
 * );
 * // Returns: 'mongodb+srv://myuser:mypassword@cluster.mongodb.net/dbname'
 *
 * @param {string} url - Database URL template with <USERNAME> and <PASSWORD> placeholders
 * @param {string} username - Database username (will be URI encoded)
 * @param {string} password - Database password (will be URI encoded)
 * @returns {string} Complete database URI with encoded credentials
 * @throws {Error} If URL is invalid, missing placeholders, or credentials are missing
 */
function buildDatabaseURI(url, username, password) {
  if (!url || typeof url !== 'string') {
    throw new Error('Database URL must be a non-empty string');
  }

  if (!url.includes('<USERNAME>') || !url.includes('<PASSWORD>')) {
    throw new Error('Database URL must contain <USERNAME> and <PASSWORD> placeholders');
  }

  if (!username || !password) {
    throw new Error('Database username and password are required');
  }

  return url
    .replace('<USERNAME>', encodeURIComponent(username))
    .replace('<PASSWORD>', encodeURIComponent(password));
}

/**
 * Handles graceful shutdown of MongoDB connection.
 * Ensures proper cleanup before process exit.
 *
 * @example
 * // Called automatically on SIGINT (Ctrl+C) or SIGTERM
 * await handleGracefulShutdown('SIGINT');
 *
 * @param {string} signal - Process signal (SIGINT, SIGTERM, or uncaughtException)
 * @returns {Promise<void>} Resolves after connection is closed
 */
async function handleGracefulShutdown(signal) {
  console.log(`🔌 MongoDB connection closing (${signal})...`);
  try {
    await mongoose.connection.close();
    console.log('🛑 Connection closed, exiting...');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
    process.exit(1);
  }
}

/**
 * Sets up graceful shutdown handlers (only once).
 * Prevents duplicate event listeners if connectDB() is called multiple times.
 *
 * Handles:
 * - SIGINT: Terminal interrupt (Ctrl+C)
 * - SIGTERM: Process termination (deployment, Docker stop)
 * - uncaughtException: Unhandled exceptions
 *
 * @returns {void}
 */
function setupGracefulShutdown() {
  if (shutdownHandlersSetup) return;
  shutdownHandlersSetup = true;

  process.once('SIGINT', () => handleGracefulShutdown('SIGINT'));
  process.once('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

  // Handle uncaught exceptions
  process.once('uncaughtException', async error => {
    console.error('💥 Uncaught Exception:', error);
    await handleGracefulShutdown('uncaughtException');
  });
}

// ======================================================================
// 4️⃣  ERROR HANDLING
// ======================================================================

/**
 * Handles various MongoDB connection and runtime errors.
 * Provides friendly tips for authentication, network, SSL, and Atlas-specific errors.
 *
 * Error categories handled:
 * - Authentication errors (bad credentials, permissions)
 * - Network errors (DNS, connection refused, timeouts)
 * - MongoDB-specific errors (server selection, SRV records)
 * - SSL/TLS errors (certificate issues)
 * - Configuration errors (malformed URI, topology)
 * - Atlas-specific errors (IP whitelist, paused cluster)
 *
 * @param {Error} error - The error object from MongoDB connection attempt
 * @returns {void}
 */
function handleMongoError(error) {
  console.error('❌ MongoDB Connection Error:', error.message);

  // Authentication Errors
  if (error.message.includes('authentication') || error.message.includes('Authentication failed')) {
    console.error('💡 Tip: Check DB username/password');
    console.error('💡 Ensure user has proper database permissions');
  }

  // Network Errors
  if (error.message.includes('ENOTFOUND')) {
    console.error('💡 Tip: DNS resolution failed - check your connection string');
  }
  if (error.message.includes('ECONNREFUSED')) {
    console.error('💡 Tip: Connection refused - database server may be down');
  }
  if (error.message.includes('ETIMEDOUT') || error.message.includes('connection timed out')) {
    console.error('💡 Tip: Connection timeout - check network/firewall');
  }
  if (error.message.includes('ECONNRESET')) {
    console.error('💡 Tip: Connection reset - network unstable or server restart');
  }

  // MongoDB-Specific Errors
  if (error.message.includes('MongoServerSelectionError')) {
    console.error('💡 Tip: Cannot connect to any MongoDB server');
  }
  if (error.message.includes('bad auth')) {
    console.error('💡 Tip: Username or password incorrect');
  }
  if (error.message.includes('not authorized')) {
    console.error('💡 Tip: User lacks permissions for this database');
  }
  if (error.message.includes('querySrv ENOTFOUND')) {
    console.error('💡 Tip: SRV record not found - check connection string format');
  }

  // SSL/TLS Errors
  if (error.message.includes('SSL') || error.message.includes('certificate')) {
    console.error('💡 Tip: SSL/TLS certificate error');
  }

  // Database/Collection Errors
  if (error.message.includes('database does not exist')) {
    console.error('💡 Tip: Database will be created on first write operation');
  }
  if (error.message.includes('no suitable servers found')) {
    console.error('💡 Tip: No matching MongoDB servers found');
  }

  // Configuration Errors
  if (error.message.includes('Invalid connection string')) {
    console.error('💡 Tip: Malformed MongoDB URI');
  }
  if (error.message.includes('topology was destroyed')) {
    console.error('💡 Tip: Connection pool closed - app may be shutting down');
  }

  // Atlas-Specific Errors
  if (error.message.includes('IP') && error.message.includes('not in whitelist')) {
    console.error('💡 Tip: Your IP is not whitelisted in MongoDB Atlas');
  }
  if (error.message.includes('cluster is paused')) {
    console.error('💡 Tip: MongoDB Atlas cluster is paused');
  }

  // Development Mode: Show Full Error Details
  if (env.FLAGS.isDevelopment) {
    console.error('📋 Full error details:', error);
  }
}

// ======================================================================
// 5️⃣  MAIN CONNECTION FUNCTION
// ======================================================================

/**
 * Connects to MongoDB using Mongoose.
 * Handles connection state, prevents multiple simultaneous connections,
 * validates connection, and sets up graceful shutdown.
 *
 * @example
 * // Basic usage
 * await connectDB();
 *
 * // Safe to call multiple times - only connects once
 * await connectDB();
 * await connectDB(); // Returns immediately if already connected
 *
 * Features:
 * - Prevents multiple connection attempts (connection promise tracking)
 * - Production-ready connection options (pooling, timeouts)
 * - Connection validation (ping test after connect)
 * - Comprehensive error handling (categorized errors with tips)
 * - Graceful shutdown setup (SIGINT, SIGTERM, uncaughtException)
 * - Handles all connection states (DISCONNECTED, CONNECTING, CONNECTED)
 *
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} If connection fails or configuration is invalid (exits process)
 */
async function connectDB() {
  const currentState = mongoose.connection.readyState;

  // Already connected - return immediately
  if (currentState === CONNECTION_STATES.CONNECTED) {
    console.log('✅ MongoDB already connected');
    return;
  }

  // Connection in progress or promise exists - wait for existing connection attempt
  if (currentState === CONNECTION_STATES.CONNECTING || connectionPromise) {
    if (connectionPromise) {
      console.log('⏳ MongoDB connection in progress, waiting...');
      try {
        // Wait for the connection to complete
        await connectionPromise;
        // After waiting, check if we're now connected
        if (mongoose.connection.readyState === CONNECTION_STATES.CONNECTED) {
          console.log('✅ MongoDB already connected');
          return;
        }
        // If promise resolved but not connected, connection failed
        // Allow retry by not returning (fall through to create new connection)
      } catch (error) {
        // Connection promise failed, clear it and allow retry
        connectionPromise = null;
        // Don't log error here - it was already logged in the promise
        // Fall through to attempt new connection
      }
    }
  }

  // Build and validate database URI
  const { URL, USERNAME, PASSWORD } = env.DATABASE;
  let DATABASE_URI;

  try {
    DATABASE_URI = buildDatabaseURI(URL, USERNAME, PASSWORD);
  } catch (error) {
    console.error('❌ Invalid database configuration:', error.message);
    process.exit(1);
  }

  // Create connection promise and store it
  connectionPromise = (async () => {
    try {
      // Attempt connection with production-ready options
      const conn = await mongoose.connect(DATABASE_URI, MONGOOSE_OPTIONS);

      // Verify connection is actually working
      await conn.connection.db.admin().ping();

      console.log('✅ MongoDB connected successfully');

      // Development mode: Log connection details
      if (env.FLAGS.isDevelopment) {
        console.log(` -> Host: ${conn.connection.host}`);
        console.log(` -> DB: ${conn.connection.name}`);
        console.log(` -> Pool size: ${MONGOOSE_OPTIONS.maxPoolSize}`);
      }

      // Set up graceful shutdown handlers (only once)
      setupGracefulShutdown();

      // Clear connection promise on success
      connectionPromise = null;
    } catch (error) {
      // Clear connection promise on error so it can be retried
      connectionPromise = null;
      handleMongoError(error);
      process.exit(1);
    }
  })();

  return connectionPromise;
}

// ======================================================================
// 6️⃣  EXPORT
// ======================================================================

module.exports = connectDB;
