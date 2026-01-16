const path = require("path");

const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");
const notFound = require("./middlewares/notFound");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

// Initialize Express app
const app = express();

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get("/health", (req, res) => {
  sendResponse(res, {
    message: "API is healthy and running smoothly 🚀",
    data: {
      uptime: process.uptime(),
    },
  });
});

// Mount routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handle undefined routes
app.all("*", notFound);

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
