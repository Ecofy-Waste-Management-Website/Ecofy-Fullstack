import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      sparse: true, // Made sparse since manual staff creation might not have a clerkId immediately
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
      // Optional because users who sign up via Clerk might not have a password
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

const User = mongoose.model("User", userSchema);
export default User;
