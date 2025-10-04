const { getClient } = require("../utils/db");

const BookingModel = {
  schema: {
    id: "SERIAL PRIMARY KEY",
    customer_name: "VARCHAR(100)",
    customer_email: "VARCHAR(100)",
    customer_phone: "VARCHAR(50)",
    doctor: "VARCHAR(50)",
    booking_date: "DATE",
    booking_time: "TIME",
    status: "VARCHAR(50)",
  },

  // TODO: check is slot available in backend

  checkAndSyncTable: async function () {
    const client = getClient();
    try {
      await client.connect();

      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT * FROM information_schema.tables 
          WHERE table_name = 'bookings'
        );`,
      );

      if (!tableCheck.rows[0].exists) {
        const columns = Object.entries(this.schema)
          .map(([name, type]) => `${name} ${type}`)
          .join(", ");

        await client.query(`CREATE TABLE bookings (${columns});`);
        console.log("Created table 'bookings'.");
      } else {
        const columnCheck = await client.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_name = 'bookings';`,
        );

        const existingColumns = columnCheck.rows.map((row) => row.column_name);

        for (const [name, type] of Object.entries(this.schema)) {
          if (!existingColumns.includes(name)) {
            await client.query(
              `ALTER TABLE bookings ADD COLUMN ${name} ${type};`,
            );
            console.log(`Added column '${name}' to 'bookings' table.`);
          }
        }

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

  isSlotAvailable: async function (date, time) {
    const client = getClient();
    try {
      await client.connect();
      const res = await pool.query(
        "SELECT COUNT(*) FROM bookings WHERE booking_date = $1 AND booking_time = $2",
        [date, time],
      );
      return res.rows[0].count == 0;
    } catch (err) {
      console.error("Error fetching exist bookings:", err.stack);
      throw err;
    }
  },

  create: async function (
    customerName,
    customerEmail,
    customerPhone,
    doctor,
    bookingDate,
    bookingTime,
    bookingStatus,
  ) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      // const available = await isSlotAvailable(bookingDate, bookingTime);
      // if (!available) throw new Error("Slot already booked");

      const query = `
        INSERT INTO bookings (customer_name, customer_email, customer_phone, doctor, booking_date, booking_time, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `;
      const values = [
        customerName,
        customerEmail,
        customerPhone,
        doctor,
        bookingDate,
        bookingTime,
        bookingStatus,
      ];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error inserting booking:", err.stack);
      throw err;
    }
  },

  update: async function (bookingStatus, id) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
      UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *;
      `;
      const values = [bookingStatus, id];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error update booking:", err.stack);
      throw err;
    }
  },

  getAll: async function () {
    const client = getClient();
    try {
      await client.connect();
      const res = await client.query("SELECT * FROM bookings");
      return res.rows;
    } catch (err) {
      console.error("Error fetching bookings:", err.stack);
      throw err;
    }
  },

  getByDoctor: async function (doctor) {
    const client = getClient();
    try {
      await client.connect();

      const query = `
      SELECT * FROM bookings WHERE (doctor) = ($1);
      `;
      const values = [doctor];
      const res = await client.query(query, values);
      return res.rows;
    } catch (err) {
      console.error("Error fetching bookings by doctor:", err.stack);
      throw err;
    }
  },
};

module.exports = { BookingModel };
