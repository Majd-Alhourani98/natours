// Import the Express application instance from the 'app' module
const app = require('./app');

// Define the port number on which the server will listen
const PORT = 3000;

// Start the server and listen on the specified port
// The callback function runs once the server is successfully running
app.listen(PORT, () => console.log(`App running on port ${PORT}...`));
