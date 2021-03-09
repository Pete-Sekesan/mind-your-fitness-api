DROP TABLE IF EXISTS workouts;

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  users_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  workout_name TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  duration numeric
);