const knex = require("knex");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUsername(knex, username) {
    return knex("users").where({ username }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, {
      subject,
      algorithm: "HS256",
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, {
      algorithm: "HS256",
    });
  },
};

module.exports = AuthService;
