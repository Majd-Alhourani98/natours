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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    requestedAt: new Date().toISOString(),
    message: 'Tours retrieved successfully',
    data: {
      tours: 'list of tours',
    },
  });
};

const createTour = (req, res) => {
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
};

const getTour = (req, res) => {
  // Access the ID from the URL parameters
  const id = req.params.id;

  console.log(`Searching for tour with ID: ${id}`);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} retrieved successfully!`,
    data: {
      tour: `Details for tour ${id}`,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log(`Updating tour ${id} with:`, updates);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} updated successfully`,
    data: {
      tour: 'updated tour details',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id;

  console.log(`Deleting tour with ID: ${id}`);

  // 204 status means 'No Content' - the request was successful but there is no data to send back
  res.status(204).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} deleted successfully`,
    data: null,
  });
};

// USERS
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of users',
    message: 'Users retrieved successfully',
    data: {
      users: 'list of users',
    },
  });
};

const createUser = (req, res) => {
  const userData = req.body;

  console.log('Registering new user:', userData);

  res.status(201).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: 'User created successfully',
    data: {
      user: userData,
    },
  });
};

const getUser = (req, res) => {
  const id = req.params.id;

  console.log(`Fetching profile for user ID: ${id}`);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} profile retrieved successfully`,
    data: {
      user: `Data for user ${id}`,
    },
  });
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log(`Updating user ${id} with:`, updates);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} updated successfully`,
    data: {
      user: 'updated user data',
    },
  });
};

app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.get('/api/v1/users', getAllUsers);
app.post('/api/v1/users', createUser);
app.get('/api/v1/users/:id', getUser);
app.patch('/api/v1/users/:id', updateUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
