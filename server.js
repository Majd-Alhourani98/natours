const connectDB = require('./config/db');

const app = require('./app');

connectDB();

// --- Server Initialization ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
  console.log(`🟢 STATUS       → Running `);
  console.log(`🔗 LINK         → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT  → ${app.get('env')}`);
  console.log(`⏰ STARTED AT   → ${new Date().toLocaleString()}\n`);
});
