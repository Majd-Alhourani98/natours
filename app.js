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

const deleteUser = (req, res) => {
  const id = req.params.id;

  res.status(204).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `User ${id} deleted successfully`,
    data: null,
  });
};

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
