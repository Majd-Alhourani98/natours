// =======================
// IMPORTS
// =======================

// Core Node.js module for file operations (reading/writing data files)
const fs = require('fs');

// Third-party middleware for logging HTTP requests in development
const morgan = require('morgan');

// Express is a minimal web framework for Node.js used to build APIs and web servers
const express = require('express');

// =======================
// APPLICATION SETUP
// =======================

// Create a new Express application
const app = express();

// --- Global Middleware Setup ---

// Use Morgan to log incoming HTTP requests (useful during development)
app.use(morgan('dev'));

// Parse incoming JSON data into req.body
app.use(express.json());

// Custom middleware that logs a simple message for every request (for demo/debugging)
app.use((req, res, next) => {
  console.log('Hello from the Middleware 👋');
  next();
});

// Middleware that attaches a timestamp to every request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// DATA LOADING
// =======================

// Read and parse tours data from the JSON file (synchronously for simplicity)
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =======================
// CONTROLLERS
// =======================

// --- Tours Controllers ---

// @desc   Get all tours
// @route  GET /api/v1/tours
const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// @desc   Get a single tour by ID
// @route  GET /api/v1/tours/:id
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  // If the tour doesn't exist, return 404
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

// @desc   Create a new tour
// @route  POST /api/v1/tours
const createTour = (req, res) => {
  // Auto-generate ID based on last element
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...req.body };
  tours.push(newTour);

  // Save updated tours data to JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// @desc   Update an existing tour
// @route  PATCH /api/v1/tours/:id
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // Placeholder response — actual file update logic would go here
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATED TOUR' },
  });
};

// @desc   Delete a tour
// @route  DELETE /api/v1/tours/:id
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // Return 204 for successful deletion with no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// --- Users Controllers (Placeholders) ---

// @desc   Get all users
// @route  GET /api/v1/users
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// @desc   Get single user
// @route  GET /api/v1/users/:id
const getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// @desc   Create new user
// @route  POST /api/v1/users
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// @desc   Update user
// @route  PATCH /api/v1/users/:id
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// =======================
// ROUTE HANDLING
// =======================

// Create separate routers for tours and users
const tourRouter = express.Router();
const userRouter = express.Router();

// Mount routers on specific API endpoints
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// --- Tours Routes ---
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

// --- Users Routes (still placeholders) ---
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

// =======================
// SERVER SETUP
// =======================

// Start the Express server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
