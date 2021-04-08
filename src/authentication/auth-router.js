const express = require("express");
const xss = require("xss");
const authRouter = express.Router();
const AuthService = require("./auth-service");
const cors = require("cors");

const corsOptions = {
  origin: "https://mind-your-fitness.vercel.app/",
  optionsSuccessStatus: 200, // For legacy browser support
};

authRouter.use(cors(corsOptions));

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

      console.log("This is DB User", dbUser);

      AuthService.comparePasswords(password, dbUser.password).then(
        (isMatch) => {
          if (!isMatch) {
            return res.status(400).json({
              error: "Incorrect username or password",
            });
          }
          //added object to subject, not sure if needed atm
          const subject = dbUser.username;
          const payload = { user_id: dbUser.id };
          console.log("This is subject and payload", subject, payload);
          res.send({
            authToken: AuthService.createJwt(payload),
          });
        }
      );
    });
  });

module.exports = authRouter;
