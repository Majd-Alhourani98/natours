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

app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.get('/api/v1/users', getAllUsers);
app.post('/api/v1/users', createUser);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
