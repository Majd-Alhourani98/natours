// =======================
// IMPORTS
// =======================

// Third-party middleware for logging HTTP requests in development
const morgan = require('morgan');

// Express: minimal Node.js framework for building APIs and web servers
const express = require('express');

// Routers for resource-specific routes
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

// =======================
// APPLICATION SETUP
// =======================

// Create a new Express application instance
const app = express();

// =======================
// GLOBAL MIDDLEWARE
// =======================

// Use Morgan to log incoming HTTP requests in the 'dev' format (useful for debugging)
app.use(morgan('dev'));

// Parse incoming JSON requests and populate req.body
app.use(express.json());

// Simple custom middleware to demonstrate logging (for demo/debug purposes)
app.use((req, res, next) => {
  console.log('Hello from the Middleware 👋');
  next();
});

// Middleware to attach a timestamp to each request object
// Useful for logging, analytics, or response metadata
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// ROUTE HANDLING
// =======================

// Mount resource-specific routers on their respective endpoints
// This keeps route logic modular and maintainable
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// =======================
// EXPORT APP
// =======================

// Export the app instance for use in server.js
// Separating app setup from server startup allows easier testing
module.exports = app;
