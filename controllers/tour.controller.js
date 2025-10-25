// --- Core Modules ---
const fs = require('fs'); // Native Node.js module for file system operations

// --- Mock Data Setup ---
// Load and parse the tours dataset (synchronously for simplicity).
// In production, this should be replaced with a database query or async read.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// --- Controllers: Tours ---
// Each controller represents a handler for a specific route and operation.

// @desc    Retrieve all tours
// @route   GET /api/v1/tours
// @access  Public
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// @desc    Retrieve a single tour by its ID
// @route   GET /api/v1/tours/:id
// @access  Public
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    // Consistent error response structure for missing resources
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

// @desc    Create a new tour
// @route   POST /api/v1/tours
// @access  Public
const createTour = (req, res) => {
  // In-memory ID generation (not safe in concurrent environments)
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...req.body };
  tours.push(newTour);

  // Persist new data back to the JSON file (simulation of database write)
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        // Always handle potential file system errors
        return res.status(500).json({
          status: 'error',
          message: 'Failed to save tour data',
        });
      }

      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

// @desc    Update an existing tour
// @route   PATCH /api/v1/tours/:id
// @access  Public
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // TODO: Implement partial update and persist to file or DB
  // This placeholder mimics a successful update response
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATED TOUR (mock)' },
  });
};

// @desc    Delete a tour
// @route   DELETE /api/v1/tours/:id
// @access  Public
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // TODO: Implement actual deletion and persistence
  // Return 204 (No Content) to signal successful deletion
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// --- Module Exports ---
// Export all route handlers for use in the tours router.
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
