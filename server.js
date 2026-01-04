const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const app = require('./app');

const DB_URL = 'mongodb://localhost:27017/natours';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB_URL);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection failed`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🖥️  SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${process.env.NODE_ENV || 'developmnet'}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}`);
  console.log(`${'━'.repeat(41)}`);
});
