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

const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    result: '<number_of_tours>',
    message: 'Tours retrieved successfully',
    data: { tours: '<list_of_tours>' },
  });
};

const createTour = (req, res) => {
  const { body: data } = req;

  console.log(data);

  return res.status(201).json({
    status: 'success',
    message: 'Tour created successfully',
    data: { tour: '<newly_created_tour>' },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully',
    data: { tour: '<tour>' },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const { body: data } = req;

  console.log(id);
  console.log(data);

  return res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully',
    data: { tour: '<tour>' },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  return res.status(200).json({
    status: 'success',
    result: '<number_of_users>',
    message: 'Users retrieved successfully',
    data: { users: '<list_of_users>' },
  });
};

const createUser = (req, res) => {
  const { body: data } = req;

  console.log(data);

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: { user: '<newly_created_user>' },
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully',
    data: { user: '<user>' },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { body: data } = req;

  console.log(id);
  console.log(data);

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
    data: { user: '<user>' },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(204).json({
    status: 'success',
    message: 'User deleted successfully',
    data: null,
  });
};

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', userRouter);
app.use('/api/v1/users', tourRouter);

// Tours routes
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// Users routes
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
