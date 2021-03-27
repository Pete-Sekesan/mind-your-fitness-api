const express = require("express");
const xss = require("xss");
const authRouter = express.Router();
const AuthService = require("./auth-service");

authRouter
  .route("/login")
  .all((req, res, next) => {
    knexInstance = req.app.get("db");
    next();
  })
  .post((req, res, next) => {
    const { username, password } = req.body;
    const user = { username, password };
    for (const field of ["username", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing ${field}`,
        });
      }
    }
    AuthService.getUserWithUsername(knexInstance, username).then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({
          error: "Incorrect username or password",
        });
      }
      AuthService.comparePasswords(password, dbUser.password).then(
        (isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              error: "Incorrect username or password",
            });
          }
          const subject = dbUser.username;
          const payload = { users_id: dbUser.id };
          res.send({
            authToken: AuthService.createJwt(subject, payload),
          });
        }
      );
    });
  });

module.exports = authRouter;
