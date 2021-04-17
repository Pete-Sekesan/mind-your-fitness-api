const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const makeUsersArray = require("./users.fixtures");
const makeWorkoutsArray = require("./workouts.fixtures");
const { expect } = require("chai");

describe("Workouts Endpoints", function () {
  let db;
  let authToken;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  beforeEach("clean the table", () =>
    db.raw("TRUNCATE  users, days RESTART IDENTITY CASCADE;")
  );

  beforeEach("register and login", () => {
    let user = { username: "authtestuser", password: "Test1234!" };
    //let users = makeUsersArray();
    return supertest(app)
      .post("/api/users")
      .send(user)
      .then((res) => {
        return supertest(app)
          .post("/api/auth/login")
          .send(user)
          .then((res2) => {
            authToken = res2.body.authToken;
          });
      });
  });

  after("disconnect from db", () => db.destroy());

  describe("GET /api/workouts", () => {
    context("Given there are users and workouts in database", () => {
      const testWorkouts = makeWorkoutsArray();
      const testUsers = makeUsersArray();
      beforeEach("insert users", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("workouts").insert(testWorkouts);
          });
      });

      it("responds with 200 and workouts", () => {
        const expectedWorkouts = [
          {
            id: 1,
            workout_name: "Running",
            date_created: "2021-04-16T13:30:06.300Z",
            duration: 50,
          },
          {
            id: 2,
            workout_name: "Swimming",
            date_created: "2021-04-16T13:30:06.300Z",
            duration: 50,
          },
          {
            id: 3,
            workout_name: "Spin",
            date_created: "2021-04-16T13:30:06.300Z",
            duration: 50,
          },
        ];
        return supertest(app)
          .get("/api/workouts")
          .set("Authorization", `bearer ${authToken}`)
          .expect(200, expectedWorkouts);
      });
    });
  });
  describe("POST /api/workouts", () => {
    it("creates a workouts, responding with 201 and new workouts", () => {
      const newWorkout = {
        workout_name: "Running",
        date_created: "2021-04-16T13:30:06.300Z",
        duration: 50,
      };
      return supertest(app)
        .post("/api/workouts")
        .set("Authorization", `bearer ${authToken}`)
        .send(newWorkout)
        .expect(201)
        .expect((res) => {
          expect(res.body.workout_name).to.equal(newWorkout.workout_name);
          expect(res.body.date_created).to.equal(newWorkout.date_created);
          expect(res.body.duration).to.equal(newWorkout.duration);
        });
    });
    const requiredFields = ["workout_name", "date_created", "duration"];

    requiredFields.forEach((field) => {
      const newWorkout = {
        workout_name: "Running",
        date_created: "2021-04-16T13:30:06.300Z",
        duration: 50,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newWorkout[field];

        return supertest(app)
          .post("/api/days")
          .set("Authorization", `bearer ${authToken}`)
          .send(newWorkout)
          .expect(400, {
            error: { message: `'${field}' is required` },
          });
      });
    });
  });
});
