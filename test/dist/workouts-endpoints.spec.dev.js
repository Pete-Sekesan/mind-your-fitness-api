"use strict";

var knex = require("knex");

var supertest = require("supertest");

var app = require("../src/app");

var makeUsersArray = require("./users.fixtures");

var makeWorkoutsArray = require("./workouts.fixtures");

var _require = require("chai"),
    expect = _require.expect;

describe("Workouts Endpoints", function () {
  var db;
  var authToken;
  before("make knex instance", function () {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  beforeEach("clean the table", function () {
    return db.raw("TRUNCATE  users, days RESTART IDENTITY CASCADE;");
  });
  beforeEach("register and login", function () {
    var user = {
      username: "authtestuser",
      password: "Test1234!"
    }; //let users = makeUsersArray();

    return supertest(app).post("/api/users").send(user).then(function (res) {
      return supertest(app).post("/api/auth/login").send(user).then(function (res2) {
        authToken = res2.body.authToken;
      });
    });
  });
  after("disconnect from db", function () {
    return db.destroy();
  });
  describe("GET /api/workouts", function () {
    context("Given there are users and workouts in database", function () {
      var testWorkouts = makeWorkoutsArray();
      var testUsers = makeUsersArray();
      beforeEach("insert users", function () {
        return db.into("users").insert(testUsers).then(function () {
          return db.into("workouts").insert(testWorkouts);
        });
      });
      it("responds with 200 and workouts", function () {
        var expectedWorkouts = [{
          id: 1,
          workout_name: "Running",
          date_created: "2021-04-16T13:30:06.300Z",
          duration: 50
        }, {
          id: 2,
          workout_name: "Swimming",
          date_created: "2021-04-16T13:30:06.300Z",
          duration: 50
        }, {
          id: 3,
          workout_name: "Spin",
          date_created: "2021-04-16T13:30:06.300Z",
          duration: 50
        }];
        return supertest(app).get("/api/workouts").set("Authorization", "bearer ".concat(authToken)).expect(200, expectedWorkouts);
      });
    });
  });
  describe("POST /api/workouts", function () {
    it("creates a workouts, responding with 201 and new workouts", function () {
      var newWorkout = {
        workout_name: "Running",
        date_created: "2021-04-16T13:30:06.300Z",
        duration: 50
      };
      return supertest(app).post("/api/workouts").set("Authorization", "bearer ".concat(authToken)).send(newWorkout).expect(201).expect(function (res) {
        expect(res.body.workout_name).to.equal(newWorkout.workout_name);
        expect(res.body.date_created).to.equal(newWorkout.date_created);
        expect(res.body.duration).to.equal(newWorkout.duration);
      });
    });
    var requiredFields = ["workout_name", "date_created", "duration"];
    requiredFields.forEach(function (field) {
      var newWorkout = {
        workout_name: "Running",
        date_created: "2021-04-16T13:30:06.300Z",
        duration: 50
      };
      it("responds with 400 and an error message when the '".concat(field, "' is missing"), function () {
        delete newWorkout[field];
        return supertest(app).post("/api/days").set("Authorization", "bearer ".concat(authToken)).send(newWorkout).expect(400, {
          error: {
            message: "'".concat(field, "' is required")
          }
        });
      });
    });
  });
});