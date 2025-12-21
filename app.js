const express = require('express');
const morgan = require('morgan');

// Routers
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'OK',
  });
});

// Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
