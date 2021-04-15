# Mind Your Fitness - API

A simple exercise logging application.

Live version: (https://mind-your-fitness.vercel.app/)

## Introduction

This app was created to allow users to have a small, standalone application to log and keep track of their exercise's and to view them all in one central location.

Setting up an account is easy. Just create a user name and password and you will be able to select from a list of predefined workouts. If you want to take a look around as well, you can log in with our Demo Account to give it a shot.

## Technologies

- Node and Express
  - Authentication via JWT
  - RESTful API
- Testing
  - Supertest (integration)
  - Mocha and Chai (unit)
- Database
  - Postgres
  - Knex.js

## Production

Deployed via Heroku

## API Endpoints

### Users Router

```
- /api/users
- - GET - gets user that matches
- - POST - creates a new user
```

### Workouts Router

```
- /api/workouts
- - GET - gets all workouts by user id
- - POST - creates a new workout
```

### Auth Router

```
- /api/auth/login
- - POST - creates auth token to be stored in local storage
```
