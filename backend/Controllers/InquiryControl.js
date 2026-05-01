const Inquiry = require("../Model/InquiryModel");

const createInquiry = async (req, res) => {
  try {
    const { userName, userEmail, subject, message } = req.body;

    if (!userName || !userEmail || !message) {
      return res.status(400).json({
        message: "Please provide userName, userEmail and message.",
      });
    }

    const inquiry = await Inquiry.create({
      userName,
      userEmail,
      subject: subject || "General Inquiry",
      message,
    });

    return res.status(201).json({
      message: "Inquiry submitted successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllInquiries = async (_req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const replyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, repliedBy } = req.body;

    if (!reply || !reply.trim()) {
      return res.status(400).json({ message: "Reply is required." });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        adminReply: reply.trim(),
        repliedBy: repliedBy || "Admin",
        repliedAt: new Date(),
        status: "Replied",
      },
      { new: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    return res.status(200).json({
      message: "Reply sent successfully.",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("Error replying to inquiry:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  replyToInquiry,
};
