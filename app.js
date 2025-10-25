// =======================
// IMPORTS
// =======================

const fs = require('fs'); // Node.js file system module
const morgan = require('morgan'); // HTTP request logger middleware
const express = require('express'); // Web framework

// =======================
// APPLICATION SETUP
// =======================

const app = express();

// Middleware
app.use(morgan('dev')); // Logs HTTP requests in development
app.use(express.json()); // Parse incoming JSON request bodies

// Custom middleware: log a message for every request
app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next();
});

// Middleware to add timestamp to request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// DATA LOADING
// =======================

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =======================
// CONTROLLERS
// =======================

// --- Tours Controllers ---

// GET /api/v1/tours
const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// GET /api/v1/tours/:id
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// POST /api/v1/tours
const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...req.body };
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATE TOUR' }, // Placeholder for actual update
  });
};

// DELETE /api/v1/tours/:id
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// --- Users Controllers (Placeholders) ---

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

const getSingleUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

const createUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

const updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

const deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

// =======================
// ROUTE HANDLING
// =======================

// Tours routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

// Users routes (placeholders)
app.route('/api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/users/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

// =======================
// SERVER SETUP
// =======================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
