const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    message: "API is healthy and running smoothly 🚀",
  });
});

// GET /api/v1/tours → returns all tours
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: "<number_of_tours>",
    message: "Tours retrieved successfully",
    data: { tours: "<list_of_tours>" },
  });
});

// GET /api/v1/tours/:id → returns a specific tour
app.get("/api/v1/tours/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: "success",
    message: "Tour retrieved successfully",
    data: {
      tour: `<tour_with_${id}>`,
    },
  });
});

// POST /api/v1/tours → creates a new tour
app.post("/api/v1/tours", (req, res) => {
  const tour = req.body;

  res.status(201).json({
    status: "success",
    message: "Tour created successfully",
    data: {
      tour: tour,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get("env")}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
