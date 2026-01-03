const app = require("./app");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get("env")}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
