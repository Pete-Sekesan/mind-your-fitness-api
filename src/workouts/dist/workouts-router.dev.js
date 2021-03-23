"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require("express");

var path = require("path");

var xss = require("xss");

var WorkoutsService = require("./workouts-service");

var _require = require("../middleware/jwt-auth"),
    requireAuth = _require.requireAuth;

var workoutsRouter = express.Router();

var serializeWorkout = function serializeWorkout(workout) {
  return {
    workout_name: xss(workout.workout_name),
    date_created: workout.date_created,
    duration: xss(workout.duration)
  };
};

workoutsRouter.route("/").get(requireAuth, function (req, res, next) {
  var knexInstance = req.app.get("db");
  var users_id = req.users.id;
  WorkoutsService.getWorkoutsByUserId(knexInstance, users_id).then(function (workouts) {
    res.json(workouts.map(serializeWorkout));
  })["catch"](next);
}).post(requireAuth, function (req, res, next) {
  var _req$body = req.body,
      workout_name = _req$body.workout_name,
      duration = _req$body.duration;
  var newWorkout = {
    workout_name: workout_name,
    duration: duration
  };

  for (var _i = 0, _Object$entries = Object.entries(newWorkout); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (value == null) return res.status(400).json({
      error: {
        message: "'".concat(key, "' is required")
      }
    });
  }

  newWorkout.users_id = req.user.id;
  WorkoutsService.insertWorkout(req.app.get("db"), newWorkout).then(function (workout) {
    res.status(201).json(serializeWorkout(workout));
  })["catch"](next);
});
module.exports = workoutsRouter;