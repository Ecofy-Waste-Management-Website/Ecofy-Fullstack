const mongoose = require("mongoose");

const serviceHistorySchema = new mongoose.Schema(
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
    serviceName: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["Repair", "Maintenance", "Installation", "Inspection", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
    },
    technicianName: {
      type: String,
    },
    notes: {
      type: String,
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

serviceHistorySchema.index({ clerkId: 1, scheduledDate: -1 });
module.exports = mongoose.model("ServiceHistory", serviceHistorySchema);
