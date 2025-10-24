// Node.js file system module for reading and writing files
const fs = require('fs');

// Import the Express module — a web framework for Node.js
const express = require('express');

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// =======================
// ROUTING EXAMPLES
// =======================

// Read tours data synchronously from a JSON file
// __dirname gives the absolute path to the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// GET request to fetch all tours
// Responds with status 200 and JSON data including results count
app.get('/api/v1/tours', (req, res) => {
  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
  });
});

// POST request to create a new tour
// Accepts JSON data from the request body, adds a new ID, and saves it
app.post('/api/v1/tours', (req, res) => {
  // Generate new ID by incrementing the last tour's ID
  const id = tours[tours.length - 1].id + 1;

  // Merge ID with request body to create a new tour object
  const newTour = { id, ...req.body };

  // Add the new tour to the tours array
  tours.push(newTour);

  // Write the updated tours array back to the JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    return res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
});

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
