// =======================
// IMPORTS
// =======================

// Node.js file system module for reading/writing files
const fs = require('fs');

// =======================
// DATA
// =======================

// Synchronously read tours data from JSON file into memory
// __dirname gives the absolute path of the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours
// Fetch all tours and send them in the response
const getAllTours = (req, res) => {
  console.log(req.requestTime); // Log timestamp added by middleware
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime, // Include timestamp in response
    results: tours.length, // Total number of tours
    data: { tours }, // Actual tours data
  });
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = (req, res) => {
  const id = Number(req.params.id); // Convert ID from string to number
  const tour = tours.find(t => t.id === id); // Find tour with matching ID

  if (!tour) {
    // Send 404 if tour not found
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Send the found tour
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// POST /api/v1/tours
// Create a new tour
const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1; // Generate new ID
  const newTour = { id, ...req.body }; // Merge ID with request data
  tours.push(newTour); // Add to in-memory array

  // Save updated tours array back to JSON file asynchronously
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    // Respond after file write completes
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id
// Update a tour (currently placeholder)
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

  // 204 No Content indicates successful deletion with no response body
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Export all controller functions for use in routes
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
