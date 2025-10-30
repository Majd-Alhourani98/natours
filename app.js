// Import the Node.js file system module
const fs = require('fs');

// Import and initialize Express
const express = require('express');
const app = express();

// Read and parse tour data from the local JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// Define a route to handle GET requests for all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // number of tours returned
    data: { tours }, // shorthand for data: { tours: tours }
  });
});

// Define a simple POST route (for testing)
app.post('/', (req, res) => {
  res.send('You posted to this endpoint');
});

// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
