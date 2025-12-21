const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'OK',
  });
});

const getAllTours = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tours retrieved successfully',
    results: '<number_of_tours>',
    data: {
      tours: '<list_of_tours>',
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour retrieved successfully',
    data: {
      tour: `<tour with id: ${id}>`,
    },
  });
};

const createTour = (req, res) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'Tour created successfully',
    data: {
      tour: '<newly_created_tour>',
    },
  });
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Users retrieved successfully',
    results: '<number_of_users>',
    data: {
      users: '<list_of_users>',
    },
  });
};

const getUser = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'User retrieved successfully',
    data: {
      tour: `<user with id: ${id}>`,
    },
  });
};

const createUser = (req, res) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'User created successfully',
    data: {
      tour: '<newly_created_user>',
    },
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'User updated successfully',
    data: {
      tour: `<updated_user_with_id_${id}>`,
    },
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(20)} 🔥 SERVER ${'━'.repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`.padStart(25));
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
