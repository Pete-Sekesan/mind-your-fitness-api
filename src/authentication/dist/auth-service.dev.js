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
  createJwt: function createJwt(payload) {
    console.log("This is where the create jwt runs ", payload);
    return jwt.sign(payload, process.env.JWT_SECRET);
  },
  verifyJwt: function verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};
module.exports = AuthService;