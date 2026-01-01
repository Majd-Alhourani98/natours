const express = require('express');

const app = express();

app.get('/health', (req, res) => {
  return res.status(200).json({
    status: 'success',
    startedAt: new Date(Date.now() - process.uptime() * 1000).toLocaleString(),
    message: 'API is healthy and running smoothly',
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started successfully and listening on port ${PORT}`);
});
