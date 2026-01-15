const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const Tour = require('./models/tour.model');
const connectDB = require('./config/database');

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours-simple.json'), 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data successfully imported!');
  } catch (error) {
    console.error('❌ Import Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(1);
  }
};

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

const run = async () => {
  const command = (process.argv[2] || '').toLowerCase();

  await connectDB();

  switch (command) {
    case '--import':
    case '-i':
      importData();
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
      process.exit(1);
  }
};

run();
