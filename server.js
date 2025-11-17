// Import the Express application instance from the 'app' module
const env = require('./config/env.config');
const app = require('./app');

const connectDB = require('./config/database.config');

connectDB();
// Start the server and listen on the specified port
// The callback function runs once the server is successfully running

const PORT = env.SERVER.PORT;
const server = app.listen(PORT, () => console.log(`App running on port ${PORT}...`));

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDELED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
