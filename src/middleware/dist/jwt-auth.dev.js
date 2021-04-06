"use strict";

var AuthService = require("../authentication/auth-service");

function requireAuth(req, res, next) {
  var authToken = req.get("Authorization") || "";
  var bearerToken;

  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({
      error: "Missing bearer token"
    });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    var payload = AuthService.verifyJwt(bearerToken);
    AuthService.getUserWithUsername(req.app.get("db"), payload.sub).then(function (user) {
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized request"
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized request"
    });
  }
}

module.exports = {
  requireAuth: requireAuth
};