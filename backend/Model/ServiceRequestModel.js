const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimelineEventSchema = new Schema(
  {
    event: { type: String, required: true },
    time:  { type: Date,   default: Date.now },
  },
  { _id: false }
);

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
      enum: ["Pending", "Assigned", "In Progress","En Route", "Completed", "Delayed"],
      default: "Pending",
    },
    notes: { type: String },
    assignedStaff: { type: String, default: null },

    // Full audit trail — auto-seeded with a "Request submitted" entry on create
    timeline: { type: [TimelineEventSchema], default: [] },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ service_type: 1 });
serviceRequestSchema.index({ location: 1 });
serviceRequestSchema.index({ createdAt: -1 });
serviceRequestSchema.index({ assignedStaff: 1 });
serviceRequestSchema.index({ assignedStaff: 1, scheduled_date: 1 });
serviceRequestSchema.index({ assignedStaff: 1, status: 1 });

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);