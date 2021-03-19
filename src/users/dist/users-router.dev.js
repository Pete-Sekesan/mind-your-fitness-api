"use strict";

var express = require("express");

var xss = require("xss");

var usersRouter = express.Router();

var UsersService = require("./users-service");

var _require = require("../middleware/jwt-auth"),
    requireAuth = _require.requireAuth;

var serializeUser = function serializeUser(user) {
  return {
    id: user.id,
    username: xss(user.username)
  };
};

usersRouter.route("/").all(function (req, res, next) {
  knexInstance = req.app.get("db");
  next();
}).get(requireAuth, function (req, res) {
  res.json(serializeUser(req.user));
}).post(function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  var REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

  for (var _i = 0, _arr = ["username", "password"]; _i < _arr.length; _i++) {
    var field = _arr[_i];

    if (!req.body[field]) {
      return res.status(400).json({
        error: "Missing ".concat(field)
      });
    }
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be 8 or more characters"
    });
  }

  if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
    return res.status(400).json({
      error: "Password must contain an upper case character, a lower case character, a number, and a special character"
    });
  }

  UsersService.hasUserWithUsername(knexInstance, username).then(function (hasUser) {
    if (hasUser) {
      return res.status(400).json({
        error: "This username already exists. Please login or try a different name. "
      });
    }

    return UsersService.hashPassword(password).then(function (hashedPassword) {
      var newUser = {
        username: username,
        password: hashedPassword
      };
      return UsersService.insertUser(knexInstance, newUser).then(function (user) {
        res.status(201).json(serializeUser(user));
      });
    });
  });
});
module.exports = usersRouter;