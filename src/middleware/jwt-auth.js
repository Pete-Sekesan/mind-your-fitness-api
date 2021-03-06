const AuthService = require("../authentication/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
    console.log(payload);
    AuthService.getUserWithId(req.app.get("db"), payload.user_id).then(
      (user) => {
        if (!user) {
          return res.status(401).json({ error: "Unauthorized request" });
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
}

module.exports = {
  requireAuth,
};
