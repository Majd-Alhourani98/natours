// 1. Import Express
const express = require('express');

// 2. Create an Express app
const app = express();

// 3. Define the port
const PORT = 3000;

// health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly 🚀',
  });
});

// 4. Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
