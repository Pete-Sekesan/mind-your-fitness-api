"use strict";

var WorkoutsService = {
  getWorkoutsByUserId: function getWorkoutsByUserId(knex, user_id) {
    return knex.from("workouts").select("*").where("users_id", users_id);
  },
  insertWorkout: function insertWorkout(knex, newWorkout) {
    return knex.insert(newWorkout).into("workouts").returning("*").then(function (rows) {
      return rows[0];
    });
  }
};
module.exports = WorkoutsService;