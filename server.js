// =======================
// IMPORT APP
// =======================

const app = require('./app');

// =======================
// SERVER CONFIGURATION
// =======================

// Define the port on which the server will listen
// In production, this should ideally come from an environment variable
const PORT = 3000;

// =======================
// START SERVER
// =======================

// Start the Express server and log a confirmation message
// The callback confirms that the server is up and running
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
