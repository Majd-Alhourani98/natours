// Import the Express module — a web framework for Node.js
const express = require('express');

// Create an Express application instance
const app = express();

// =======================
// ROUTING EXAMPLES
// =======================

// GET request on root URL '/'
// Responds with JSON data and a 200 status code
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from the server side!',
    app: 'Natours',
  });
});

// POST request on root URL '/'
// Responds with a plain text message when a POST request is made
app.post('/', (req, res) => {
  res.send('You post to this endpoint');
});

// =======================
// SERVER SETUP
// =======================

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and make it listen on the defined port
// The callback function runs once the server starts successfully
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
