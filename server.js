const app = require('./app');

// --- Server Initialization ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
  console.log(`🔗 LINK: http://localhost:${PORT}`);
  console.log(`⏰ STARTED AT: ${new Date().toLocaleString()}\n`);
});
