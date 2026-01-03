const express = require('express');

const tourRouter = require('./routes/tour.routes');
const userRouter = require('./routes/user.routes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
