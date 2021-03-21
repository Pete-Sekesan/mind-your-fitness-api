"use strict";

var WorkoutsService = {
  getWorkoutsByUserId: function getWorkoutsByUserId(knex, users_id) {
    return knex.from("workouts").select("*").where("users_id", users_id);
  },
  //insert a new logged workout into the workouts table.
  insertWorkout: function insertWorkout(knex, newWorkout) {
    return knex.insert(newWorkout).into("workouts").returning("*").then(function (rows) {
      return rows[0];
    });
  }
};
module.exports = WorkoutsService;