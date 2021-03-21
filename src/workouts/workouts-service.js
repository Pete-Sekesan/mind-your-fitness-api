const WorkoutsService = {
  getWorkoutsByUserId(knex, user_id) {
    return knex.from("workouts").select("*").where("users_id", users_id);
  },
  insertWorkout(knex, newWorkout) {
    return knex
      .insert(newWorkout)
      .into("workouts")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = WorkoutsService;
