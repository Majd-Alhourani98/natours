// app.js

const express = require('express');
const morgan = require('morgan');

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

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: '<number_of_users_placeholder>',
    message: 'Users retrieved successfully.',
    data: {
      users: '<users_list_placeholder>',
    },
  });
};

const createUser = (req, res) => {
  const payload = req.body;

  // Placeholder for creation logic (DB, validation, etc.)
  const createdUser = payload;

  res.status(201).json({
    status: 'success',
    message: 'User created successfully.',
    data: {
      user: '<created_user_placeholder>',
    },
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `User with id "${id}" retrieved successfully.`,
    data: {
      user: '<user_placeholder>',
    },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `User with id "${id}" updated successfully.`,
    data: {
      user: '<updated_user_placeholder>',
    },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// 4. Start the server
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
