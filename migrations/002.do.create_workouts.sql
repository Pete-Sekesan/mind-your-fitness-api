DROP TABLE IF EXISTS workouts;

DROP TYPE IF EXISTS workout_name;
CREATE TYPE workout_name AS ENUM (
    'Running',
    'Walking',
    'Hiking',
    'Swimming',
    'Cycling',
    'Spin',
    'Weightlifting',
    'Yoga',
    'HIIT',
    'Elliptical',
    'Other'
);

CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  users_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  workout_name TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  duration numeric
);