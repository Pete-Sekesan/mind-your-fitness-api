"use strict";

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var config = require("../config");

var AuthService = {
  getUserWithId: function getUserWithId(knex, user_id) {
    return knex("users").where({
      id: user_id
    }).first();
  },
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