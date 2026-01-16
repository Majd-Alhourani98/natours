const path = require('path');

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');
const notFound = require('./errors/notFound');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', notFound);

app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
