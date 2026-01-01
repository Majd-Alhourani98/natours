// 1. Import Express
const express = require('express');

// 2. Create an Express app
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  // new Date() → exact moment (UTC internally)
  // Logging → shows local time (your computer timezone)
  // .toISOString() → shows UTC, universal for everyone
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: '<number_of_tours_placeholder>',
    message: 'Tours retrieved successfully.',
    data: {
      tours: '<tours_list_placeholder>',
    },
  });
};

const createTour = (req, res) => {
  const payload = req.body;

  // Placeholder for creation logic (DB, validation, etc.)
  const createdTour = payload;

  res.status(201).json({
    status: 'success',
    message: 'Tour created successfully.',
    data: {
      tour: '<created_tour_placeholder>',
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `Tour with id "${id}" retrieved successfully.`,
    data: {
      tour: '<tour_placeholder>',
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `Tour with id "${id}" updated successfully.`,
    data: {
      tour: '<updated_tour_placeholder>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// 4. Start the server
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
