const { BookingModel } = require("../models/bookingModel");

const BookingController = {
  addBooking: async (req, res) => {
    const { name, email, phone, doctor, date, time, status } = req.body;
    console.log("req.body", req.body);
    try {
      const newBooking = await BookingModel.create(
        name,
        email,
        phone,
        doctor,
        date,
        time,
        status,
      );

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(newBooking));
    } catch (error) {
      console.error("Error in addBooking:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to create booking" }));
    }
  },

  updateBooking: async (req, res) => {
    const { status, note, id } = req.body;
    console.log("req.body", req.body);
    try {
      const doctorUpdateBooking = await BookingModel.update(status, note, id);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(doctorUpdateBooking));
    } catch (error) {
      console.error("Error in updateBooking:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to update booking" }));
    }
  },

  getBookings: async (req, res) => {
    try {
      const bookings = await BookingModel.getAll();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(bookings));
    } catch (error) {
      console.error("Error in getBookings:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Failed to retrieve bookings" }));
    }
  },

  getBookingsByDoctor: async (req, res, doctor) => {
    console.log("req.body", req.body);
    try {
      const bookings = await BookingModel.getByDoctor(doctor);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(bookings));
    } catch (error) {
      console.error("Error in getBookingsByDoctor:", error.stack);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ error: "Failed to retrieve bookings by doctor" }),
      );
    }
  },
};

module.exports = BookingController;
