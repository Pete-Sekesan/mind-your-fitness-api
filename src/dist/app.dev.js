"use strict";

require("dotenv").config();

var express = require("express");

var morgan = require("morgan");

var cors = require("cors");

var helmet = require("helmet");

var _require = require("./config"),
    NODE_ENV = _require.NODE_ENV,
    CLIENT_ORIGIN = _require.CLIENT_ORIGIN;

var workoutsRouter = require("./workouts/workouts-router");

var usersRouter = require("./users/users-router");

var authRouter = require("./authentication/auth-router");

var app = express();
var morganOption = NODE_ENV === "production" ? "tiny" : "common";
app.use(express.json());
app.use(morgan(morganOption));
app.use(cors({
  origin: CLIENT_ORIGIN
}));
app.use(helmet());
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