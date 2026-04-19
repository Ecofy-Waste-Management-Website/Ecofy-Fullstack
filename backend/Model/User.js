const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
