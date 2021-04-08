"use strict";

var express = require("express");

var xss = require("xss");

var authRouter = express.Router();

var AuthService = require("./auth-service");

var cors = require("cors");

var corsOptions = {
  origin: "https://mind-your-fitness.vercel.app/",
  optionsSuccessStatus: 200 // For legacy browser support

};
authRouter.use(cors(corsOptions));
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

  AuthService.getUserWithUsername(knexInstance, username).then(function (dbUser) {
    if (!dbUser) {
      return res.status(400).json({
        error: "Incorrect username or password"
      });
    }

    console.log("This is DB User", dbUser);
    AuthService.comparePasswords(password, dbUser.password).then(function (isMatch) {
      if (!isMatch) {
        return res.status(400).json({
          error: "Incorrect username or password"
        });
      } //added object to subject, not sure if needed atm


      var subject = dbUser.username;
      var payload = {
        user_id: dbUser.id
      };
      console.log("This is subject and payload", subject, payload);
      res.send({
        authToken: AuthService.createJwt(payload)
      });
    });
  });
});
module.exports = authRouter;