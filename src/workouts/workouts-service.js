const WorkoutsService = {
  getWorkoutsByUserId(knex, user_id) {
    return knex.from("workouts").select("*").where("user_id", user_id);
  },
  //insert a new logged workout into the workouts table.
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
