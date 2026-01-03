const path = require("path");

const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(morgan("dev"));

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

module.exports = app;
