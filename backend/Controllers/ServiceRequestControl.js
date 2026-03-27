const ServiceRequest = require("../Model/ServiceRequestModel");

// POST - Create a new waste collection booking
const createBooking = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      service_type,
      waste_category,
      location,
      scheduled_date,
      notes,
    } = req.body;

    const newBooking = new ServiceRequest({
      customer_name,
      customer_email,
      service_type,
      waste_category,
      location,
      scheduled_date,
      notes,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.log("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET - Fetch all bookings (Admins/Staff)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await ServiceRequest.find().sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.log("Error fetching all bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET - Fetch bookings for a specific customer by email
const getUserBookings = async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await ServiceRequest.find({ customer_email: email }).sort({
      createdAt: -1,
    });

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    return res.status(200).json(bookings);
  } catch (error) {
    console.log("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH - Update booking status (Staff/Admins)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Assigned",
      "In Progress",
      "Completed",
      "Delayed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const updatedBooking = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.log("Error updating booking status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
};
