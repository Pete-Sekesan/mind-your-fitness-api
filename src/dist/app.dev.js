"use strict";

require("dotenv").config();

var express = require("express");

var morgan = require("morgan");

var cors = require("cors");

var helmet = require("helmet");

var _require = require("./config"),
    NODE_ENV = _require.NODE_ENV;

var workoutsRouter = require("./workouts/workouts-router");

var usersRouter = require("./users/users-router");

var authRouter = require("./authentication/auth-router");

var app = express();
var morganOption = NODE_ENV === "production" ? "tiny" : "common";
app.use(express.json());
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(function (req, res, next) {
  // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Origin", "https://mind-your-fitness.vercel.app/.TLD");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/workouts", workoutsRouter);
app.use(function errorHandler(error, req, res, next) {
  var response;

  if (NODE_ENV === "production") {
    response = {
      error: {
        message: "server error"
      }
    };
  } else {
    console.error(error);
    response = {
      message: error.message,
      error: error
    };
  }

  res.status(500).json(response);
});
module.exports = app;