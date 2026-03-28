const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    transaction_ref: { type: String, required: true },
    service_type: {
      type: String,
      enum: ["Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"],
      required: true,
    },
    payment_date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);