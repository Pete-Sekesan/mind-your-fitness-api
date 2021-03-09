DROP TABLE IF EXISTS workouts;

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES 
  workout_name TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  duration numeric
);