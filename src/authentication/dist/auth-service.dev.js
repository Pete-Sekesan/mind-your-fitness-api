"use strict";

var knex = require("knex");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var config = require("../config");

var AuthService = {
  getUserWithUsername: function getUserWithUsername(knex, username) {
    return knex("users").where({
      username: username
    }).first();
  },
  comparePasswords: function comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt: function createJwt(subject, payload) {
    return jwt.sign(payload, {
      subject: subject,
      algorithm: "HS256"
    });
  },
  verifyJwt: function verifyJwt(token) {
    return jwt.verify(token, {
      algorithm: "HS256"
    });
  }
};
module.exports = AuthService;