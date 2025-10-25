const app = require('./app');

// Start the Express server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
