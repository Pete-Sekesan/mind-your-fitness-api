require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const workoutsRouter = require("./workouts/workouts-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./authentication/auth-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";
app.use(express.json());
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(function (req, res, next) {
  // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Origin",
    "https://mind-your-fitness.vercel.app/.TLD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/workouts", workoutsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
