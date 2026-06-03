const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
      default: () => new mongoose.Types.ObjectId(),
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['Customer', 'Staff', 'Admin'],
      default: 'Customer',
    },
    firstName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    preferences: {
      emailNotification: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
    status: {
      type: String,
      enum: ['Activate', 'Suspended', 'Banned'],
      default: 'Activate',
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Busy', 'Off Duty'],
      default: 'Available',
    },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      branch: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
