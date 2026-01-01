const express = require('express');

const app = express();

app.use(express.json());

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

app.post('/api/v1/tours', (req, res) => {
  const { body: data } = req;

  console.log(data);

  return res.status(201).json({
    status: 'success',
    message: 'Tour created successfully',
    data: { tour: '<newly_created_tour>' },
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
