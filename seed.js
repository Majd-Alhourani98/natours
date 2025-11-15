// ============================================================================
//  Data Seeder Script (Import / Delete)
// ============================================================================

// Core modules
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Mongoose model
const Tour = require('./models/tour.model');

// Load environment variables
dotenv.config({ path: `${__dirname}/.env.development` });

// Validate required env values
const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

if (!DATABASE_URL || !DATABASE_USERNAME || !DATABASE_PASSWORD) {
  console.error('❌ Missing required environment variables.');
  process.exit(1);
}

// Build full database URI
const DATABASE_URI = DATABASE_URL.replace('<USERNAME>', DATABASE_USERNAME).replace(
  '<PASSWORD>',
  DATABASE_PASSWORD
);

// Load local JSON data
let tours = [];
try {
  tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
} catch (error) {
  console.error('❌ Failed to load local data file.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Connect to MongoDB
// ---------------------------------------------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Import data into database
// ---------------------------------------------------------------------------
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data successfully imported!');
  } catch (error) {
    console.error('❌ Import Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

// ---------------------------------------------------------------------------
// Delete all data from database
// ---------------------------------------------------------------------------
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('✅ Data successfully deleted!');
  } catch (error) {
    console.error('❌ Delete Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

// ---------------------------------------------------------------------------
// CLI Command Handler
// ---------------------------------------------------------------------------
const run = async () => {
  const command = (process.argv[2] || '').toLowerCase();

  await connectDB();

  switch (command) {
    case '--import':
    case '-i':
      await importData();
      break;

    case '--delete':
    case '-d':
      await deleteData();
      break;

    default:
      console.log('ℹ️  Usage:');
      console.log('     1.   --import   or  -i   Import data');
      console.log('     2.   --delete   or  -d   Delete data');
      await mongoose.connection.close();
      process.exit();
  }
};

run();
