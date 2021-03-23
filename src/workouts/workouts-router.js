const express = require("express");
const path = require("path");
const xss = require("xss");
const WorkoutsService = require("./workouts-service");
const { requireAuth } = require("../middleware/jwt-auth");

const workoutsRouter = express.Router();

const serializeWorkout = (workout) => ({
  workout_name: xss(workout.workout_name),
  date_created: workout.date_created,
  duration: xss(workout.duration),
});
workoutsRouter
  .route("/")
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get("db");

    const users_id = req.users.id;
    WorkoutsService.getWorkoutsByUserId(knexInstance, users_id)
      .then((workouts) => {
        res.json(workouts.map(serializeWorkout));
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const { workout_name, duration } = req.body;
    const newWorkout = { workout_name, duration };

    for (const [key, value] of Object.entries(newWorkout))
      if (value == null)
        return res.status(400).json({
          error: { message: `'${key}' is required` },
        });
    newWorkout.users_id = req.user.id;
    WorkoutsService.insertWorkout(req.app.get("db"), newWorkout)
      .then((workout) => {
        res.status(201).json(serializeWorkout(workout));
      })
      .catch(next);
  });

module.exports = workoutsRouter;
