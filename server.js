const mongoose = require('mongoose');

const app = require('./app');

const DB_URI = 'mongodb://localhost:27017/natours';
mongoose
  .connect(DB_URI)
  .then((conn) => {
    console.log(
      `✅ MongoDB connected successfully
       📦 Database: ${mongoose.connection.name}
       🌐 Host: ${mongoose.connection.host}
      `
    );
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });

// --- Server Initialization ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
  console.log(`🔗 LINK: http://localhost:${PORT}`);
  console.log(`⏰ STARTED AT: ${new Date().toLocaleString()}\n`);
});
