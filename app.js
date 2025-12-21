const express = require('express');
const app = express();

app.use(express.json());

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

app.get('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour retrieved successfully',
    data: {
      tour: `tour with id: ${id}`,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'Tour created successfully',
    data: {
      tour: '<newly_created_tour>',
    },
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour updated successfully',
    data: {
      tour: `<updated_tour_with_id_${id}>`,
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
