const  { getClient } = require("../utils/db");

const BookingModel = {
  // Expected table schema
  schema: {
    id: "SERIAL PRIMARY KEY",
    customer_name: "VARCHAR(100)",
    customer_email: "VARCHAR(100)",
    customer_phone: "VARCHAR(100)",
    booking_date: "DATE",
    booking_time: "TIME",
    status: "VARCHAR(50)",
  },

  // Method to check and create/update the table schema
  checkAndSyncTable: async function () {
    const client = getClient(); // Create a new client instance
    try {
      await client.connect();

      // Check if the table exists
      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT * FROM information_schema.tables 
          WHERE table_name = 'bookings'
        );`,
      );

      // If the table doesn't exist, create it
      if (!tableCheck.rows[0].exists) {
        const columns = Object.entries(this.schema)
          .map(([name, type]) => `${name} ${type}`)
          .join(", ");

        await client.query(`CREATE TABLE bookings (${columns});`);
        console.log("Created table 'bookings'.");
      } else {
        // If the table exists, ensure it has the correct columns
        const columnCheck = await client.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_name = 'bookings';`,
        );

        const existingColumns = columnCheck.rows.map((row) => row.column_name);

        // Add missing columns
        for (const [name, type] of Object.entries(this.schema)) {
          if (!existingColumns.includes(name)) {
            await client.query(
              `ALTER TABLE bookings ADD COLUMN ${name} ${type};`,
            );
            console.log(`Added column '${name}' to 'bookings' table.`);
          }
        }

        // (Optional) Handle extra columns by removing them
        for (const column of existingColumns) {
          if (!this.schema[column]) {
            await client.query(`ALTER TABLE bookings DROP COLUMN ${column};`);
            console.log(
              `Removed extra column '${column}' from 'bookings' table.`,
            );
          }
        }
      }
    } catch (err) {
      console.error("Error syncing table schema:", err.stack);
      throw err;
    }
  },

  // Insert a new booking, ensuring the table schema is correct
  create: async function (
    customerName,
    customerEmail,
    customerPhone,
    bookingDate,
    bookingTime
  ) {
    const client = getClient(); // Create a new client instance
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
        INSERT INTO bookings (customer_name, customer_email, customer_phone, booking_date, booking_time)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
      const values = [
        customerName,
        customerEmail,
        customerPhone,
        bookingDate,
        bookingTime
      ];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error inserting booking:", err.stack);
      throw err;
    }
  },

  getAll: async function () {
    const client = getClient(); // Create a new client instance
    try {
      await client.connect();
      const res = await client.query("SELECT * FROM bookings");
      return res.rows;
    } catch (err) {
      console.error("Error fetching bookings:", err.stack);
      throw err;
    }
  },
};

module.exports = { BookingModel };

// const createBooking = async (bookingData) => {
//   try {
//     const res = await client.query("SELECT NOW()");
//     console.log("Database time:", res.rows[0].now);
//   } catch (err) {
//     console.error("Query error", err.stack);
//   } finally {
//     client.end(); // Close the connection
//   }

//   testQuery();
//   // const query = `
//   //   INSERT INTO bookings (name, email, phone, booking_date, service)
//   //   VALUES ($1, $2, $3, $4, $5) RETURNING *;
//   // `;
//   // const values = [
//   //   bookingData.name,
//   //   bookingData.email,
//   //   bookingData.phone,
//   //   bookingData.booking_date,
//   //   bookingData.service,
//   // ];
//   // const result = await client.query(query, values);
//   // return result.rows[0];
// };

// module.exports = { createBooking };
