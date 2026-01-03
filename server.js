const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const app = require('./app');

const DB_URL = 'mongodb://localhost:27017/natours';

mongoose
  .connect(DB_URL)
  .then(conn => {
    console.log('✅ Database connected successfully');
  })
  .catch(err => {
    console.error(`❌ MongoDB connection failed`);
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${process.env.NODE_ENV || 'developmnet'}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
