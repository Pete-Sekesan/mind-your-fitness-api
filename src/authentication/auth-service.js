const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  async getUserWithId(knex, user_id) {
    return await knex("users").where({ id: user_id }).first();
  },

  async getUserWithUsername(knex, username) {
    return await knex("users").where({ username }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(payload) {
    console.log("This is where the create jwt runs ", payload);
    return jwt.sign(payload, process.env.JWT_SECRET);
  },
  verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = AuthService;
