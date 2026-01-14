const dotenv = require("dotenv").config();

const connectDB = require("./config/db");

const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${process.env.NODE_ENV}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});

// SAFETY NET: Handling Unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  // Give the server time to finish pending requests before closing
  server.close(() => {
    process.exit(1); // 1 stands for 'uncaught exception'
  });
});
