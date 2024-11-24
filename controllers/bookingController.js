const { BookingModel } = require("../models/bookingModel");

const BookingController = {
  addBooking: async (req, res) => {
    const {
      name,
      email,
      phone,
      date,
      time,
    } = req.body;
    console.log("req.body", req.body)
    try {
      const newBooking = await BookingModel.create(
        name,
      email,
      phone,
      date,
      time,
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
};

module.exports = BookingController;
