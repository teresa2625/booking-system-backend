const PatientController = require("../controllers/patientController");

const patientRoutes = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET") {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    const patient = reqUrl.searchParams.get("patient");
    console.log("req", patient);
    if (patient) {
      await PatientController.getInfoByPatient(req, res, patient);
    } else {
      await PatientController.getPatient(req, res);
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = JSON.parse(body);
      await PatientController.addPatient(req, res);
    });
  } else if (req.method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = JSON.parse(body);
      await PatientController.updatePatient(req, res);
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
};

module.exports = patientRoutes;
