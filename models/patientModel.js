const { getClient } = require("../utils/db");

const PatientModel = {
  schema: {
    id: "SERIAL PRIMARY KEY",
    file_num: "VARCHAR(50)",
    full_name: "VARCHAR(100)",
    dob: "VARCHAR(100)",
    email: "VARCHAR(100)",
    phone: "VARCHAR(100)",
    address: "VARCHAR(100)",
    occupation: "VARCHAR(500)",
    complaint: "VARCHAR(500)",
    currentRX: "VARCHAR(500)",
    tests: "VARCHAR(500)",
    medication: "VARCHAR(500)",
    others: "VARCHAR(500)",
    neuro: "VARCHAR(500)",
    ortho: "VARCHAR(500)",
    vasc: "VARCHAR(500)",
    oe: "VARCHAR(500)",
    rx: "VARCHAR(500)",
    dx: "VARCHAR(500)",
    pxrec: "VARCHAR(500)",
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

  create: async function (
    fileNum,
    patientName,
    patientEmail,
    patientPhone,
    notes,
    patientDOB,
    patientAddress,
    occupation,
    complaint,
    currentRX,
    tests,
    medication,
    others,
    neuro,
    ortho,
    vasc,
    oe,
    rx,
    dx,
    pxrec,
  ) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
        INSERT INTO patients (file_num, full_name, email, phone, notes, dob, address, occupation, complaint,
        currentRX, tests, medication, others, neuro, ortho, vasc, oe, rx, dx, pxrec)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
        $18, $19, $20) RETURNING *;
      `;
      const values = [
        fileNum,
        patientName,
        patientEmail,
        patientPhone,
        notes,
        patientDOB,
        patientAddress,
        occupation,
        complaint,
        currentRX,
        tests,
        medication,
        others,
        neuro,
        ortho,
        vasc,
        oe,
        rx,
        dx,
        pxrec,
      ];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error inserting patient:", err.stack);
      throw err;
    }
  },

  update: async function (doctorNotes, fileNum, patientName, patientEmail) {
    const client = getClient();
    try {
      await client.connect();
      await this.checkAndSyncTable();

      const query = `
      UPDATE patients SET notes = $1 
      WHERE file_num = $2 AND full_name = $3 AND email = $4 RETURNING *;

      `;
      const values = [doctorNotes, fileNum, patientName, patientEmail];
      const res = await client.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error update patient:", err.stack);
      throw err;
    }
  },

  getAllPatientInfo: async function () {
    const client = getClient();
    try {
      await client.connect();
      const res = await client.query("SELECT DISTINCT * FROM patients");
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
      SELECT * FROM patients WHERE (full_name) = ($1);
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
