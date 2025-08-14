const BookingController = require("../controllers/bookingController");

const bookingRoutes = async (req, res) => {
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
    const doctor = reqUrl.searchParams.get("doctor");
    console.log("req", doctor);
    if (doctor) {
      await BookingController.getBookingsByDoctor(req, res, doctor);
    } else {
      await BookingController.getBookings(req, res);
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = JSON.parse(body);
      await BookingController.addBooking(req, res);
    });
  } else if (req.method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      req.body = JSON.parse(body);
      await BookingController.updateBooking(req, res);
    });
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
};

module.exports = bookingRoutes;
