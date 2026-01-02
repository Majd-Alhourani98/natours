// app.js

const express = require('express');
const morgan = require('morgan');

// Routers
const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

// 2. Create an Express app
const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3. Define the port
const PORT = 3000;

// health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly 🚀',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4. Start the server
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
