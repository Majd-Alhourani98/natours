const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'OK',
  });
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tours retrieved successfully',
    results: '<number_of_tours>',
    data: {
      tours: '<list_of_tours>',
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(20)} 🔥 SERVER ${'━'.repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`.padStart(25));
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
