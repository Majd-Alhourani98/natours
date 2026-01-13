const path = require("path");

const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    uptime: process.uptime(),
    message: "API is healthy and running smoothly 🚀",
  });
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.status = "fail";

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
