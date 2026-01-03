const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    message: "API is healthy and running smoothly 🚀",
  });
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get("env")}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
