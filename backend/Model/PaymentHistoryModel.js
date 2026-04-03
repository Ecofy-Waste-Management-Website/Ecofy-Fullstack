const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Cash", "Bank Transfer", "Online"],
      default: "Card",
    },
    description: {
      type: String,
    },
    referenceId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentHistorySchema.index({ clerkId: 1, createdAt: -1 });
module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);