// Node.js file system module for reading files
const fs = require('fs');

// Import the Express module
const express = require('express');

// Create an Express application instance
const app = express();

// =======================
// ROUTING EXAMPLES
// =======================

// Read tours data synchronously from a JSON file
// __dirname gives the absolute path to the current directory
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// GET request to fetch all tours
// Responds with status 200 and JSON data including results count
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours },
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
