const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const Tour = require('./models/tour.model');
const connectDB = require('./config/database');

const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours-simple.json')));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data successfully imported!');
  } catch (error) {
    console.error('❌ Import Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('✅ Data successfully deleted!');
  } catch (error) {
    console.error('❌ Delete Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

const run = async () => {
  await connectDB();

  const command = (process.argv[2] || '').toLowerCase();

  switch (command) {
    case '--import':
    case '-i':
      await importData();

    case '--delete':
    case '-d':
      await deleteData();

    default:
      console.log('ℹ️  Usage:');
      console.log('     1.   --import   or  -i   Import data');
      console.log('     2.   --delete   or  -d   Delete data');
      await mongoose.connection.close();
      process.exit();
  }
};

run();
