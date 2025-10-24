// Import the Express module
const express = require('express');

// Create an Express application instance
const app = express();

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and make it listen on the defined port
// The callback function runs once the server starts successfully
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
