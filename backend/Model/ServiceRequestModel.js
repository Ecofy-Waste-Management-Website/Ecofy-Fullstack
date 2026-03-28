const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema(
  {
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    service_type: {
      type: String,
      enum: ["Household", "Commercial", "Bulk", "Garden", "Drain Cleaning"],
      required: true,
    },
    waste_category: {
      type: String,
      enum: ["General", "Recyclable", "Hazardous", "Electronic", "Garden"],
      required: true,
    },
    location: { type: String, required: true },
    scheduled_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Completed", "Delayed"],
      default: "Pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);