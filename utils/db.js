const { Client } = require("pg");

// Database connection function
const getClient = () => {
  return new Client({
    user: "myuser",
    host: "localhost",
    database: "mydatabase",
    password: "mypassword",
    port: 5432,
  });
};
module.exports = { getClient };
