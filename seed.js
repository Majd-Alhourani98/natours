const fs = require('fs');

const mongoose = require('mongoose');

const Tour = require('./models/tour.model');
const connectDB = require('./config/db');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data successfully loaded!');
    process.exit(); // Exit the script
  } catch (error) {
    console.log('❌', error);
    process.exit(); // Exit the script
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // Remove all tours
    console.log('✅ Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log('❌', error);
  }
};

const run = async () => {
  const command = process.argv[2]?.toLowerCase();
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
