TRUNCATE workouts, users  RESTART IDENTITY CASCADE;

INSERT INTO users
    (username, password)
    VALUES
    ('testuser1', 'password'),
    ('testuser2', 'password1');

    INSERT INTO workouts
    (id, users_id, workout_name, date_created, duration)
    VALUES
    (1,1, 'Running','2021-03-15 10:00:00', 30),
    (2,1, 'Walking','2021-03-15 08:00:00',60),
    (3,1, 'Swimming','2021-03-15 07:00:00',15),
    (4,1, 'Running','2021-03-15 08:00:00',45),
    (5,1, 'Weightlifting','2021-03-15 11:00:00',70),
    (6,1, 'Yoga','2021-03-15 06:00:00',30);
ALTER SEQUENCE "workouts_id_seq" RESTART WITH 7;