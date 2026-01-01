const express = require('express');

const app = express();

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly',
  });
});

app.get('/api/v1/tours', (req, res) => {
  return res.status(200).json({
    status: 'success',
    result: '<number_of_tours>',
    message: 'Tours retrieved successfully',
    data: { tours: '<list_of_tours>' },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
