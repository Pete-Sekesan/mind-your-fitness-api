"use strict";

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var config = require("../config");

var AuthService = {
  getUserWithId: function getUserWithId(knex, user_id) {
    return regeneratorRuntime.async(function getUserWithId$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(knex("users").where({
              id: user_id
            }).first());

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  getUserWithUsername: function getUserWithUsername(knex, username) {
    return regeneratorRuntime.async(function getUserWithUsername$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(knex("users").where({
              username: username
            }).first());

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
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