"use strict";

var knex = require("knex");

var app = require("./app");

var _require = require("./config"),
    PORT = _require.PORT,
    DB_URL = _require.DB_URL;

var db = knex({
  client: "pg",
  connection: DB_URL
});
app.set("db", db);
app.listen(PORT, function () {
  console.log("Server listening at http://localhost:".concat(PORT));
});