DROP TABLE IF EXISTS workouts;

DROP TYPE IF EXISTS workout;
CREATE TYPE workout AS ENUM (
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
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  workout_name workout,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  duration numeric
);

