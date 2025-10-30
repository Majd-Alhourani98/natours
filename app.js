// =======================
// IMPORTS
// =======================

// Node.js module for file system operations (read/write files)
const fs = require('fs');

// Morgan middleware for logging HTTP requests; useful for debugging and monitoring
const morgan = require('morgan');

// Express framework for building web applications and APIs
const express = require('express');

// =======================
// APPLICATION SETUP
// =======================

// Create an instance of an Express application
const app = express();

// Use Morgan to log details of HTTP requests in 'dev' format
// This shows method, URL, status code, response time, and more
app.use(morgan('dev'));

// Middleware to parse JSON in incoming requests and attach it to req.body
// Required to handle POST, PATCH requests with JSON payload
app.use(express.json());

// Custom middleware: logs a simple message for every incoming request
// Demonstrates how middleware works before hitting routes
app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next(); // Pass control to the next middleware or route handler
});

// Middleware to attach a timestamp to every request
// Useful for debugging and logging when a request was made
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // Pass control to the next middleware or route handler
});

// =======================
// DATA LOADING
// =======================

// Synchronously read tours data from JSON file
// __dirname provides the absolute path to the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours - fetch all tours
// Sends all tours along with a timestamp and count of results
const getAllTours = (req, res) => {
  console.log(req.requestTime); // Log the timestamp to the console
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime, // Include request timestamp in response
    results: tours.length, // Total number of tours
    data: { tours }, // Send tours data
  });
};

// GET /api/v1/tours/:id - fetch a single tour by ID
const getSingleTour = (req, res) => {
  const id = Number(req.params.id); // Convert route param from string to number
  const tour = tours.find(t => t.id === id); // Search tour by ID

  // If no tour found with given ID, send 404 response
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // If found, send tour data
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// POST /api/v1/tours - create a new tour
const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1; // Generate new ID
  const newTour = { id, ...req.body }; // Merge ID with request body
  tours.push(newTour); // Add new tour to in-memory array

  // Write updated tours array back to JSON file asynchronously
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    // Respond after file write is complete
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id - update an existing tour
// Currently a placeholder; does not modify data
const updateTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Placeholder response for future update logic
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATE TOUR' },
  });
};

// DELETE /api/v1/tours/:id - delete a tour by ID
const deleteTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Send 204 No Content to indicate successful deletion with no response body
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Placeholder user controllers
// Currently respond with 500 indicating not implemented
const getAllUsers = (req, res) =>
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
const getSingleUser = (req, res) =>
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
const createUser = (req, res) =>
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
const updateUser = (req, res) =>
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
const deleteUser = (req, res) =>
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });

// =======================
// ROUTES
// =======================
// Create separate Express Router instances for modular routing
const tourRouter = express.Router();
const userRouter = express.Router();

// Mount routers on specific path prefixes
// All tour routes will now start with /api/v1/tours
app.use('/api/v1/tours', tourRouter);

// All user routes will now start with /api/v1/users
app.use('/api/v1/users', userRouter);

// =======================
// TOUR ROUTES
// =======================

// '/' handles GET (all tours) and POST (create new tour)
tourRouter.route('/').get(getAllTours).post(createTour);

// '/:id' handles GET (single tour), PATCH (update), DELETE (remove)
tourRouter.route('/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

// =======================
// USER ROUTES (placeholders)
// =======================

// '/' handles GET (all users) and POST (create user)
userRouter.route('/').get(getAllUsers).post(createUser);

// '/:id' handles GET (single user), PATCH (update), DELETE (remove)
userRouter.route('/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

// =======================
// SERVER
// =======================

// Port configuration
const PORT = 3000;

// Start server and listen for incoming requests
// Logs a message once server is running
app.listen(PORT, () => console.log(`App running on port ${PORT}...`));
