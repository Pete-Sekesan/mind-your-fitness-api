"use strict";

var knex = require("knex");

var app = require("./app");

var _require = require("./config"),
    PORT = _require.PORT,
    DATABASE_URL = _require.DATABASE_URL;

var db = knex({
  client: "pg",
  connection: DATABASE_URL
});
app.set("db", db);
pg.defaults.ssl = process.env.NODE_ENV === "production" ? {
  rejectUnauthorized: false
} : false;
app.listen(PORT, function () {
  console.log("Server listening at http://localhost:".concat(PORT));
});