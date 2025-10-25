// =======================
// IMPORTS
// =======================

// Node.js file system module for reading and writing files
const fs = require('fs');

// Morgan — HTTP request logger middleware
const morgan = require('morgan');

// Express module — a web framework for Node.js
const express = require('express');

// =======================
// APPLICATION SETUP
// =======================

// Create an Express application instance
const app = express();

// Use morgan middleware for logging HTTP requests in 'dev' format
app.use(morgan('dev'));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Custom middleware: log a simple message for every request
app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next(); // Pass control to the next middleware or route handler
});

// Middleware to add a timestamp to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// =======================
// DATA LOADING
// =======================

// Read tours data synchronously from a JSON file
// __dirname gives the absolute path to the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours
// Fetch all tours
const getAllTours = (req, res) => {
  console.log(req.requestTime); // Log the timestamp added by middleware
  return res.status(200).json({
    status: 'success',
    requestAt: req.requestTime, // Include timestamp in response
    results: tours.length,
    data: { tours: tours },
  });
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = (req, res) => {
  const id = Number(req.params.id); // Convert route param from string to number
  const tour = tours.find((tour) => tour.id === id);

  // Handle case when tour is not found
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { tour: tour },
  });
};

// POST /api/v1/tours
// Create a new tour
const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1; // Generate a new ID
  const newTour = { id, ...req.body }; // Merge new ID with request body
  tours.push(newTour); // Add new tour to in-memory array

  // Write the updated tours array back to the JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    return res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id
// Update an existing tour (currently a placeholder)
const updateTour = (req, res) => {
  const id = Number(req.params.id);

  // Validate tour ID
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Placeholder response for update logic
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATE TOUR' },
  });
};

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = (req, res) => {
  const id = Number(req.params.id);

  // Validate tour ID
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // 204 No Content indicates success with no response body
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// =======================
// ROUTE HANDLING
// =======================

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Chain routes using Express route() for cleaner structure
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getSingleUser).patch(updateUser).delete(deleteUser);

// =======================
// SERVER SETUP
// =======================

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and listen on the defined port
// Logs a message to the console once the server is running
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
