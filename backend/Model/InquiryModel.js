const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      default: "General Inquiry",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Replied"],
      default: "Pending",
    },
    adminReply: {
      type: String,
      default: "",
      trim: true,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
    repliedBy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);

// const mongoose = require("mongoose");

// const inquirySchema = new mongoose.Schema(
//   {
//     ticketNumber: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     clerkId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     category: { type: String, required: true },
//     subject: { type: String, required: true },
//     message: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["Open", "In Progress", "Resolved", "Closed"],
//       default: "Open",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Inquiry", inquirySchema);
