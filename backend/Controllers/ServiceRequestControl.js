const ServiceRequest = require("../Model/ServiceRequestModel");
const Notification = require("../Model/NotificationModel");
const { randomInt } = require("crypto");

const SERVICE_PRICES = {
  Household: 150000,
  Commercial: 350000,
  Bulk: 250000,
  Garden: 120000,
  "Drain Cleaning": 200000,
};

const generatePickupPin = () => String(randomInt(100000, 1000000));

const normalizePickupCoordinates = (pickupCoordinates) => {
  if (!pickupCoordinates) return null;

  const latitude = typeof pickupCoordinates.latitude === "number"
    ? pickupCoordinates.latitude
    : Number(pickupCoordinates.latitude);
  const longitude = typeof pickupCoordinates.longitude === "number"
    ? pickupCoordinates.longitude
    : Number(pickupCoordinates.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { latitude, longitude };
};

const geocodePickupLocation = async (location) => {
  const query = typeof location === "string" ? location.trim() : "";
  if (!query) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "Ecofy-Fullstack/1.0",
    },
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!Array.isArray(results) || !results[0]) return null;

  const latitude = Number(results[0].lat);
  const longitude = Number(results[0].lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return { latitude, longitude };
};

const generatePickupPin = () => String(Math.floor(100000 + Math.random() * 900000));

const STATUS_NOTIFICATIONS = {
  Assigned: {
    title: "Pickup Assigned",
    message: "Your pickup request has been assigned to a driver. We'll be with you soon!",
    type: "Info",
  },
  "In Progress": {
    title: "Pickup In Progress",
    message: "Your pickup is now in progress! Our team is on the way.",
    type: "Info",
  },
  Completed: {
    title: "Pickup Completed",
    message: "Your pickup has been completed successfully. Thank you!",
    type: "Success",
  },
  Delayed: {
    title: "Pickup Delayed",
    message: "Your pickup has been delayed. We apologize for the inconvenience.",
    type: "Warning",
  },
  Pending: {
    title: "Pickup Pending",
    message: "Your pickup request is back to pending status.",
    type: "Info",
  },
  Cancelled: {
    title: "Pickup Cancelled",
    message: "Your pickup request has been cancelled successfully.",
    type: "Warning",
  },
};
// POST - Create a new waste collection booking
const createBooking = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      clerkId,
      service_type,
      waste_category,
      location,
      pickupCoordinates,
      scheduled_date,
      notes,
    } = req.body;

<<<<<<< HEAD
    const pickupPin = generatePickupPin();
=======
    const servicePrice = SERVICE_PRICES[service_type] || 0;
    const pickupPin = req.body.pickupPin || generatePickupPin();
    const normalizedCoordinates = normalizePickupCoordinates(pickupCoordinates);
    const resolvedCoordinates = normalizedCoordinates || await geocodePickupLocation(location);

    if (!resolvedCoordinates) {
      return res.status(400).json({
        message: "Pickup coordinates could not be resolved. Please choose a more precise pickup location or use the map picker.",
      });
    }
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51

    const newBooking = new ServiceRequest({
      customer_name,
      customer_email,
<<<<<<< HEAD
      customer_phone,
=======
      customer_phone: customer_phone || "",
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
      clerkId,
      service_type,
      waste_category,
      location,
      pickupCoordinates: resolvedCoordinates,
      scheduled_date,
      notes,
<<<<<<< HEAD
=======
      servicePrice,
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
      pickupPin,
    });

    const savedBooking = await newBooking.save();

    await Notification.create({
      title: "New Service Request",
      message: `${customer_name} has submitted a ${service_type} request scheduled for ${new Date(scheduled_date).toLocaleDateString()}.`,
      type: "Info",
      target: "admin",
    });

    await Notification.create({
      clerkId: "",             // empty = broadcast to all staff
      title: "New Pickup Request",
      message:`A new ${savedBooking.service_type || 'service'} request was submitted at ${savedBooking.location || 'unknown location'}.`,
      type: "Info",
      target: "staff",
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
      pickupPin,
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

    if (updatedBooking.clerkId && STATUS_NOTIFICATIONS[status]) {
      const { title, message, type } = STATUS_NOTIFICATIONS[status];
      await Notification.create({
        clerkId: updatedBooking.clerkId,
        title,
        message,
        type,
        target: "user",
      });
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

// PATCH - Cancel a booking for the owning customer
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { clerkId, customer_email } = req.body;

    const booking = await ServiceRequest.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "Completed") {
      return res.status(400).json({ message: "Completed orders cannot be cancelled" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    const normalizedEmail = typeof customer_email === "string" ? customer_email.trim().toLowerCase() : "";
    const bookingEmail = typeof booking.customer_email === "string" ? booking.customer_email.trim().toLowerCase() : "";
    const isOwner = Boolean(normalizedEmail) && bookingEmail === normalizedEmail;
    const isClerkOwner = Boolean(clerkId) && booking.clerkId === clerkId;

    if (!isOwner && !isClerkOwner) {
      return res.status(403).json({ message: "You can only cancel your own order" });
    }

    booking.status = "Cancelled";
    booking.assignedStaff = null;
    booking.timeline.push({ event: "Pickup cancelled by customer", time: new Date() });

    await booking.save();

    await Notification.create({
      title: "Pickup Cancelled",
      message: `${booking.customer_name} cancelled a ${booking.service_type} pickup scheduled for ${new Date(booking.scheduled_date).toLocaleDateString()}.`,
      type: "Warning",
      target: "admin",
      relatedService: null,
    });

    if (booking.clerkId) {
      await Notification.create({
        clerkId: booking.clerkId,
        title: "Pickup Cancelled",
        message: "Your pickup order has been cancelled successfully.",
        type: "Warning",
        target: "user",
        relatedService: null,
      });
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.log("Error cancelling booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
};
