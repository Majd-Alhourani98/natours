const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const globalErrorHandler = require('./errors/globalErrorHandler');

const app = express();

// Parse incoming JSON request
app.use(express.json());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// log HTTP requests
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    startDate: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
  });
});

//  --- Mounting Routers ---
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
