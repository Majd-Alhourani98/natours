// Import the Express framework
const express = require('express');

// Import Morgan middleware for logging HTTP requests
const morgan = require('morgan');

const env = require('./config/env.config');
const cookieParser = require('cookie-parser');
// Import route handlers for tours and users
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const notFound = require('./middlewares/notFound');

// Create an instance of an Express application
const app = express();
// app.set('query parser', 'extended');
// Parse cookies
app.use(cookieParser());
// Middleware: HTTP request logger using Morgan in 'dev' format
if (env.FLAGS.isDevelopment) {
  app.use(morgan('dev'));
}

if (env.FLAGS.isProduction) app.set('trust proxy', true);

// Middleware: Parse incoming JSON requests and put the data in req.body
app.use(express.json());

// Serve all files inside the public folder
app.use(express.static(`${__dirname}/public`));

// Custom middleware: Adds a timestamp to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // Pass control to the next middleware
});

// Mount the tourRouter on the /api/v1/tours path
app.use('/api/v1/tours', tourRouter);
// Mount the userRouter on the /api/v1/users path
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', notFound);

app.use(globalErrorHandler);

// Export the app so it can be used by the server (e.g., in server.js)
module.exports = app;
