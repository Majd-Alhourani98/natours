const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

const app = express();

// Middleware
app.use(express.json());

// HTTP request logger middleware
app.use(morgan('dev'));

//  --- Mounting Routers ---
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
