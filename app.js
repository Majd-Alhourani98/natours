const express = require("express");
const morgan = require("morgan");

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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: "<number_of_tours>",
    message: "Tours retrieved successfully",
    data: { tours: "<list_of_tours>" },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: "success",
    message: "Tour retrieved successfully",
    data: {
      tour: `<tour_with_${id}>`,
    },
  });
};

const createTour = (req, res) => {
  const tour = req.body;

  res.status(201).json({
    status: "success",
    message: "Tour created successfully",
    data: {
      tour: tour,
    },
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Get all users: This route is not yet defined",
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  res.status(200).json({
    status: "success",
    message: "Tour updated successfully",
    data: {
      tour: data, // In a real app, this would be the merged updated tour
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).send();
};

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${"━".repeat(20)} 🔥 SERVER ${"━".repeat(20)}`);
  console.log(`🟢 STATUS      → Running`);
  console.log(`🔗 LINK        → http://localhost:${PORT}`);
  console.log(`🌍 ENVIRONMENT → ${app.get("env")}`);
  console.log(`⏰ STARTED AT  → ${new Date().toLocaleTimeString()}\n`);
});
