const pg = require("pg");

const db = new pg.Client({
  user: "postgres",
  host: process.env.POSTGRES_HOST,
  database: "idenion",
  password: "moheet@333",
  port: 5432,
});

module.exports = db;
