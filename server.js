const app = require('./app');

const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/natours';
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(
      `✅ MongoDB connected successfully
       📦 Database: ${mongoose.connection.name}
       🌐 Host: ${mongoose.connection.host}
      `
    );
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// 4. Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(15)} 🔥 SERVER ${'━'.repeat(15)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get('env')}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
