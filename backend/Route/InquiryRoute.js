const express = require("express");
const router = express.Router();
const Inquiry = require("../Model/InquiryModel");
const Notification = require("../Model/NotificationModel");

// Generate a unique ticket number e.g. ECO-48392
const generateTicketNumber = async () => {
  while (true) {
    const ticket = `ECO-${Math.floor(10000 + Math.random() * 90000)}`;
    const exists = await Inquiry.findOne({ ticketNumber: ticket });
    if (!exists) return ticket;
  }
};

// POST /inquiries — Submit a new inquiry
router.post("/", async (req, res) => {
  try {
    const { clerkId, name, email, phone, category, subject, message } = req.body;

    if (!clerkId || !name || !email || !phone || !category || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const ticketNumber = await generateTicketNumber();

    // Save the inquiry
    const inquiry = await Inquiry.create({
      ticketNumber,
      clerkId,
      name,
      email,
      phone,
      category,
      subject,
      message,
    });

    // Create a notification for the user
    await Notification.create({
      clerkId,
      title: "Inquiry Submitted",
      message: `Your inquiry "${subject}" has been received. Ticket #${ticketNumber}. We'll respond within 1–2 business days.`,
      type: "Info",
    });

    return res.status(201).json({ ticketNumber: inquiry.ticketNumber });
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /inquiries/:clerkId — Get all inquiries for a user (optional, useful later)
router.get("/:clerkId", async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ clerkId: req.params.clerkId }).sort({ createdAt: -1 });
    return res.json({ inquiries });
  } catch (err) {
    console.error("Fetch inquiries error:", err);
    return res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;