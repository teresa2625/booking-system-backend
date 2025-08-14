const { PatientModel } = require("../models/patientModel");

const PatientController = {
  addPatient: async (req, res) => {
    const { name, DOB, notes } = req.body;
    console.log("req.body", req.body);
    try {
      const newPatient = await BookingModel.create(
        name,
        DOB,
        notes
      );

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(newPatient));
    } catch (error) {
      console.error("Error in addPatient:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to create patient" }));
    }
  },

  updatePatient: async (req, res) => {
    const { note, id } = req.body;
    console.log("req.body", req.body);
    try {
      const doctorAddNotes = await PatientModel.update(note, id);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(doctorAddNotes));
    } catch (error) {
      console.error("Error in updatePatient:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to update notes" }));
    }
  },

  getPatients: async (req, res) => {
    try {
      const patients = await PatientModel.getAll();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(patients));
    } catch (error) {
      console.error("Error in getPatients:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to retrieve patients" }));
    }
  },

  getPatientInfoByName: async (req, res) => {
    const { patient } = req.body;
    console.log("req.body", req.body);
    try {
      const patientInfo = await PatientModel.getByPatient(patient);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(patientInfo));
    } catch (error) {
      console.error("Error in getPatientInfoByName:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to retrieve patient info" }));
    }
  },
};

module.exports = PatientController;
