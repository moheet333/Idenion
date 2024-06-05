const pg = require("pg");

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "idenion",
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
});

module.exports = db;
