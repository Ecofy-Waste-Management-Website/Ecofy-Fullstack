const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../Controllers/ServiceRequestControl");

// POST /  -  Create a new booking
router.post("/", createBooking);

// GET /  -  Fetch all bookings (Admin/Staff)
router.get("/", getAllBookings);

// GET /user/:email  -  Fetch bookings for a specific customer
router.get("/user/:email", getUserBookings);

// PATCH /:id/status  -  Update booking status (Staff/Admin)
router.patch("/:id/status", updateBookingStatus);

// PATCH /:id/cancel - Cancel a booking for the owning customer
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
