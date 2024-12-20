const { Client } = require("pg");
require("dotenv").config();

const getClient = () => {
  return new Client({
    user: process.env.DB_USER,
    host: "localhost",
    database: "mydatabase",
    password: process.env.DB_PASSWORD,
    port: 5432,
  });
};
module.exports = { getClient };
