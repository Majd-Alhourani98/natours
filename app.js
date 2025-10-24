// Node.js file system module for reading and writing files
const fs = require('fs');

// Import the Express module — a web framework for Node.js
const express = require('express');

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

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
  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = (req, res) => {
  const id = Number(req.params.id); // Convert route param to number

  const tour = tours.find((tour) => tour.id === id);

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
  const id = tours[tours.length - 1].id + 1;

  const newTour = { id, ...req.body };

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    return res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id
// Update an existing tour (placeholder)
const updateTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Placeholder for actual update logic
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATE TOUR' },
  });
};

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = (req, res) => {
  const id = Number(req.params.id);

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

// Chain routes using Express route() for cleaner structure
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

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
