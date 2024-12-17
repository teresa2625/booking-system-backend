const bcrypt = require("bcryptjs");
const { getClient } = require("../utils/db");
const UserModel = {
  schema: {
    id: "SERIAL PRIMARY KEY",
    user_first_name: "VARCHAR(100)",
    user_last_name: "VARCHAR(100)",
    password: "VARCHAR(255)",
    customer_email: "VARCHAR(100)",
    customer_phone: "VARCHAR(100)",
    role: "VARCHAR(50)",
    created_at: "TIMESTAMP",
  },

  checkAndSyncTable: async function () {
    const client = getClient();
    try {
      await client.connect();

      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT * FROM information_schema.tables 
          WHERE table_name = 'users'
        );`,
      );

      if (!tableCheck.rows[0].exists) {
        const columns = Object.entries(this.schema)
          .map(([name, type]) => `${name} ${type}`)
          .join(", ");

        await client.query(`CREATE TABLE users (${columns});`);
        console.log("Created table 'users'.");
      } else {
        const columnCheck = await client.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_name = 'users';`,
        );

        const existingColumns = columnCheck.rows.map((row) => row.column_name);

        for (const [name, type] of Object.entries(this.schema)) {
          if (!existingColumns.includes(name)) {
            await client.query(`ALTER TABLE users ADD COLUMN ${name} ${type};`);
            console.log(`Added column '${name}' to 'users' table.`);
          }
        }

        for (const column of existingColumns) {
          if (!this.schema[column]) {
            await client.query(`ALTER TABLE users DROP COLUMN ${column};`);
            console.log(`Removed extra column '${column}' from 'users' table.`);
          }
        }
      }
    } catch (err) {
      console.error("Error syncing table schema:", err.stack);
      throw err;
    }
  },

  createUser: async function (
    userFirstName,
    userLastName,
    password,
    emailAddress,
    phoneNumber,
    role,
  ) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();
      const today = new Date();

      const result = await client.query(
        "INSERT INTO users (user_first_name, user_last_name, password, customer_email, customer_phone, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, customer_email, role",
        [
          userFirstName,
          userLastName,
          password,
          emailAddress,
          phoneNumber,
          role,
          today.toLocaleDateString(),
        ],
      );
      console.log("result", result);
      return result.rows[0];
    } catch (err) {
      console.error("Error inserting booking:", err.stack);
      throw err;
    }
  },

  getUserByUsername: async function (username) {
    const client = getClient();
    await client.connect();
    await this.checkAndSyncTable();
    const result = await client.query(
      "SELECT * FROM users WHERE customer_email = $1",
      [username],
    );
    return result.rows[0];
  },
};

module.exports = { UserModel };
