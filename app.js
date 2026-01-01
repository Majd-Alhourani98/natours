const express = require('express');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly',
  });
});

// GET request to retrieve all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    requestedAt: new Date().toISOString(),
    message: 'Tours retrieved successfully',
    data: {
      tours: 'list of tours',
    },
  });
});

// POST request to create a new tour
app.post('/api/v1/tours', (req, res) => {
  const data = req.body;

  console.log('New Tour Data Received:', data);

  res.status(201).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: 'Tour created successfully!',
    data: {
      tour: data,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
