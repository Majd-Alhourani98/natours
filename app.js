// =======================
// IMPORTS
// =======================

// Third-party middleware for logging HTTP requests in development
const morgan = require('morgan');

// Express is a minimal web framework for Node.js used to build APIs and web servers
const express = require('express');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

// =======================
// APPLICATION SETUP
// =======================

// Create a new Express application
const app = express();

// --- Global Middleware Setup ---

// Use Morgan to log incoming HTTP requests (useful during development)
app.use(morgan('dev'));

// Parse incoming JSON data into req.body
app.use(express.json());

// Custom middleware that logs a simple message for every request (for demo/debugging)
app.use((req, res, next) => {
  console.log('Hello from the Middleware 👋');
  next();
});

// Middleware that attaches a timestamp to every request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// DATA LOADING
// =======================

// =======================
// CONTROLLERS
// =======================

// =======================
// ROUTE HANDLING
// =======================

// Create separate routers for tours and users

// Mount routers on specific API endpoints
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// =======================
// SERVER SETUP
// =======================

module.exports = app;
