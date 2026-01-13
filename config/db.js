const mongoose = require("mongoose");

// const DB_URI = "mongodb://localhost:27017/natours";
const DB_URI = process.env.DATABASE_URL.replace(
  "USERNAME",
  process.env.DATABASE_USERNAME,
)
  .replace("PASSWORD", process.env.DATABASE_PASSWORD)
  .replace("DATABASE_NAME", process.env.DATABASE_NAME);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`\n${"━".repeat(20)} 💾 DATABASE ${"━".repeat(20)}`);
    console.log(`🟢 STATUS      → Connected`);
    console.log(`📦 Database:   → ${mongoose.connection.name}`);
    console.log(`🌐 Host        → ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
