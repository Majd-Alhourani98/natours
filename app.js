// Import the Node.js file system module for reading/writing data
const fs = require('fs');

// Import and initialize Express
const express = require('express');
const app = express();

// Middleware: parses incoming JSON requests into req.body
app.use(express.json());

// Load and parse tours data from local JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =============================
// ROUTE HANDLERS
// =============================

// GET /api/v1/tours → returns all tours
app.get('/api/v1/tours', (req, res) => {
  return res.status(200).json({
    status: 'success',
    results: tours.length, // total number of tours
    data: { tours },
  });
});

// GET /api/v1/tours/:id → returns a single tour by its ID
app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id); // convert the ID param from string to number

  // Basic validation for out-of-range IDs
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Find the tour with the matching ID
  const tour = tours.find(tour => tour.id === id);

  // If not found, return a 404 (alternative robust validation)
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  // Send successful response
  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// POST /api/v1/tours → creates a new tour and saves it to the JSON file
app.post('/api/v1/tours', (req, res) => {
  // Generate new ID based on the last tour's ID
  const id = tours[tours.length - 1].id + 1;

  // Create a new tour object combining the ID and request body
  const newTour = { id, ...req.body };

  // Add the new tour to the in-memory array
  tours.push(newTour);

  // Persist updated data back to the JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    // Send response after successfully writing the file
    return res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
});

// =============================
// SERVER SETUP
// =============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
