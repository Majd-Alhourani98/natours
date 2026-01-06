/**
 * Express Server Configuration
 * This script initializes a basic web server using the Express framework.
 */

// Import the Express framework
const express = require('express');

// Initialize the Express application instance
const app = express();

/**
 * Middleware: JSON Parser
 * Intercepts incoming requests with JSON payloads and parses them into
 * a JavaScript object accessible via req.body.
 */
app.use(express.json());

/**
 * Server Initialization
 * Configures the port and starts the listening process.
 */

// GET /api/v1/tours - Retrieves all tours and sends them in a JSON response
app.get('/api/v1/tours', (req, res) => {
  const tours = 'list_of_all_tours';

  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    data: {
      tours: 'list_of_all_tours',
    },
    message: 'Tours retrieved successfully',
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  // Visual separator for better terminal readability
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);

  // Log operational metadata
  console.log(`🟢 STATUS         → Running `);
  console.log(`🔗 LINK           → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT    → ${app.get('env')}`); // Displays 'development' or 'production'
  console.log(`⏰ STARTED AT     → ${new Date().toLocaleString()}\n`);
});
