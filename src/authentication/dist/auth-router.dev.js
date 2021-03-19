"use strict";

var express = require("express");

var xss = require("xss");

var authRouter = express.Router();

var AuthService = require("./auth-service");

authRouter.route("/login").all(function (req, res, next) {
  knexInstance = req.app.get("db");
  next();
}).post(function (req, res, next) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  var user = {
    username: username,
    password: password
  };

  for (var _i = 0, _arr = ["username", "password"]; _i < _arr.length; _i++) {
    var field = _arr[_i];

    if (!req.body[field]) {
      return res.status(400).json({
        error: "Missing ".concat(field)
      });
    }
  }

  AuthService.getUserByUsername(knexInstance, username).then(function (dbUser) {
    if (!dbUser) {
      return res.status(400).json({
        error: "Incorrect username or password"
      });
    }

    AuthService.comparePasswords(password, dbUser.password).then(function (isMatch) {
      if (!isMatch) {
        return res.status(400).json({
          error: "Incorrect username or password"
        });
      }

      var subject = dbUser.username;
      var payload = {
        user_id: dbUser.id
      };
      res.send({
        authToken: AuthService.createJwt(subject, payload)
      });
    });
  });
});
module.exports = authRouter;