const { getClient } = require("../utils/db");

const PatientModel = {
  schema: {
    id: "SERIAL PRIMARY KEY",
    patient_name: "VARCHAR(100)",
    patient_DOB: "VARCHAR(100)",
    patient_email: "VARCHAR(100)",
    patient_phone: "VARCHAR(100)",
    notes: "VARCHAR(500)",
  },

  checkAndSyncTable: async function () {
    const client = getClient();
    try {
      await client.connect();

      const tableCheck = await client.query(
        `SELECT EXISTS (
          SELECT * FROM information_schema.tables 
          WHERE table_name = 'patients'
        );`,
      );

      if (!tableCheck.rows[0].exists) {
        const columns = Object.entries(this.schema)
          .map(([name, type]) => `${name} ${type}`)
          .join(", ");

        await client.query(`CREATE TABLE patients (${columns});`);
        console.log("Created table 'patients'.");
      } else {
        const columnCheck = await client.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_name = 'patients';`,
        );

        const existingColumns = columnCheck.rows.map((row) => row.column_name);

        for (const [name, type] of Object.entries(this.schema)) {
          if (!existingColumns.includes(name)) {
            await client.query(
              `ALTER TABLE patients ADD COLUMN ${name} ${type};`,
            );
            console.log(`Added column '${name}' to 'patients' table.`);
          }
        }

        for (const column of existingColumns) {
          if (!this.schema[column]) {
            await client.query(`ALTER TABLE patients DROP COLUMN ${column};`);
            console.log(
              `Removed extra column '${column}' from 'patients' table.`,
            );
          }
        }
      }
    } catch (err) {
      console.error("Error syncing table schema:", err.stack);
      throw err;
    }
  },

  create: async function (patientName, patientDOB, notes) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
        INSERT INTO patients (patient_name, patient_DOB, notes)
        VALUES ($1, $2, $3) RETURNING *;
      `;
      const values = [patientName, patientDOB, notes];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error inserting patient:", err.stack);
      throw err;
    }
  },

  update: async function (doctorNotes, id) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
      UPDATE patients SET (notes) = ($1) WHERE (id) = ($2) RETURNING *;
      `;
      const values = [doctorNotes, id];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error update patient:", err.stack);
      throw err;
    }
  },

  getAll: async function () {
    const client = getClient();
    try {
      await client.connect();
      const res = await client.query("SELECT * FROM patients");
      return res.rows;
    } catch (err) {
      console.error("Error fetching patients:", err.stack);
      throw err;
    }
  },

  getByPatient: async function (patient) {
    const client = getClient();
    try {
      await client.connect();

      const query = `
      SELECT * FROM patients WHERE (patient_name) = ($1);
      `;
      const values = [patient];
      const res = await client.query(query, values);
      return res.rows;
    } catch (err) {
      console.error("Error fetching patient INFO by patient name:", err.stack);
      throw err;
    }
  },
};

module.exports = { PatientModel };
