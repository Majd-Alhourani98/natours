// Node.js file system module for reading and writing files
const fs = require('fs');

// Import the Express module — a web framework for Node.js
const express = require('express');

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests into JS objects
app.use(express.json());

// =======================
// LOAD DATA
// =======================

// Read tours data synchronously from a JSON file when the app starts
// __dirname gives the absolute path to the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =======================
// ROUTES
// =======================

// GET /api/v1/tours
// Fetch all tours and send them as JSON
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// GET /api/v1/tours/:id
// Fetch a single tour by its ID
app.get('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id); // Convert ID (string) to number
  const tour = tours.find((tour) => tour.id === id); // Find tour by ID

  // If no tour is found, return 404 Not Found
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Respond with the found tour
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// POST /api/v1/tours
// Create a new tour and save it to the JSON file
app.post('/api/v1/tours', (req, res) => {
  const id = tours[tours.length - 1].id + 1; // Generate new ID
  const newTour = { id, ...req.body }; // Combine ID with request data

  tours.push(newTour); // Add new tour to the list

  // Write updated tours back to the file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
});

// PATCH /api/v1/tours/:id
// Update specific fields of an existing tour
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = Number(req.params.id); // Convert ID from URL to a number
  const tour = tours.find((tour) => tour.id === id); // Find tour by ID

  // If tour not found, send 404 response
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Update the tour object with the fields provided in req.body
  const updatedTour = { ...tour, ...req.body };

  // Replace the old tour with the updated one inside the array
  const tourIndex = tours.findIndex((el) => el.id === id);
  tours[tourIndex] = updatedTour;

  // Save the updated tours array back to the JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: 'success',
      data: { tour: updatedTour },
    });
  });
});

// =======================
// SERVER SETUP
// =======================

// Define the port number for the server
const PORT = 3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
