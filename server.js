const mongoose = require("mongoose");

const app = require("./app");

const DB_URI = "mongodb://localhost:27017/natours";
mongoose
  .connect(DB_URI)
  .then((conn) => {
    console.log(`\n${"━".repeat(20)} 💾 DATABASE ${"━".repeat(20)}`);
    console.log(`🟢 STATUS      → Connected`);
    console.log(`📦 Database:   → ${mongoose.connection.name}`);
    console.log(`🌐 Host        → ${mongoose.connection.host}`);
  })

  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get("env")}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
