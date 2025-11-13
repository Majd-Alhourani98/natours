// Import the Express application instance from the 'app' module
const env = require('./config/env.config');
const app = require('./app');

const connectDB = require('./config/database.config');
const { default: mongoose } = require('mongoose');
const { required } = require('joi');

connectDB();
// Start the server and listen on the specified port
// The callback function runs once the server is successfully running

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },

  rating: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// create a model from a schema
// a convention to use Uppercase for model
const Tour = mongoose.model('Tour', tourSchema);

const PORT = env.SERVER.PORT;
app.listen(PORT, () => console.log(`App running on port ${PORT}...`));
