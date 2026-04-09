const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Info", "Success", "Warning", "Alert"],
      default: "Info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceHistory",
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ clerkId: 1, createdAt: -1 });
notificationSchema.index({ clerkId: 1, isRead: 1 });
module.exports = mongoose.model("Notification", notificationSchema);