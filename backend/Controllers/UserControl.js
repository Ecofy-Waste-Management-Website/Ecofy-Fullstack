<<<<<<< HEAD
const User = require("../Model/UserModule");
const { clerkClient } = require("@clerk/clerk-sdk-node");
=======
const User = require("../Model/User.js");
const LegacyUser = require("../Model/UserModule");
const PaymentHistory = require("../Model/PaymentHistoryModel");
const ServiceHistory = require("../Model/ServiceHistoryModel");
const ServiceRequest = require("../Model/ServiceRequestModel");
const { clerkClient } = require("@clerk/clerk-sdk-node");
const Notification = require("../Model/NotificationModel");
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51

const jwt = require("jsonwebtoken");

//User creation Function 
const createUser = async (req, res) => {
  try {
    const { clerkId , role, firstName, lastName, email } = req.body;

    //check if required fields are updated ! 
    if (!firstName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if the user already exits 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
  }
    //Validate the User 
    const newUser = new User({
      clerkId,
      role,
      firstName,
      lastName,
      email,
    });

    await newUser.save();

    await Notification.create({
      title: "New User Registered",
      message: `${firstName} ${lastName || ""} (${email}) has just created an account.`,
      type: "Info",
      target: "admin",
    });

    res.status(201).json({ message: "New User created Successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "debug : Internal server Error" });
  }
};

const normalizeUser = (user, source) => ({
  ...user.toObject(),
  source,
});

const buildOrderHistory = (user, payments, serviceHistory, bookings) => {
  const timeline = [
    ...payments.map((payment) => ({
      id: payment._id,
      type: "Payment",
      title: payment.description || "Payment recorded",
      subtitle: `${payment.paymentMethod || "Payment"} • ${payment.currency || "USD"}`,
      status: payment.status,
      amount: payment.amount,
      date: payment.paidAt || payment.createdAt,
      raw: payment,
    })),
    ...serviceHistory.map((item) => ({
      id: item._id,
      type: "Service",
      title: item.serviceName,
      subtitle: item.serviceType,
      status: item.status,
      amount: item.cost,
      date: item.completedDate || item.scheduledDate || item.createdAt,
      raw: item,
    })),
    ...bookings.map((booking) => ({
      id: booking._id,
      type: "Booking",
      title: booking.service_type || "Waste pickup order",
      subtitle: booking.waste_category || booking.location || booking.customer_email,
      status: booking.status,
      amount: booking.total_amount || booking.amount || null,
      date: booking.scheduled_date || booking.createdAt,
      raw: booking,
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    user,
    totals: {
      payments: payments.length,
      services: serviceHistory.length,
      bookings: bookings.length,
      items: timeline.length,
    },
    timeline,
    payments,
    serviceHistory,
    bookings,
  };
};

// Get all users (Admin dashboard)
const getAllUsers = async (req, res) => {
  try {
    const [primaryUsers, legacyUsers] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select("-password -__v"),
      LegacyUser.find().sort({ createdAt: -1 }).select("-__v"),
    ]);

    const seen = new Set();
    const users = [...primaryUsers.map((user) => normalizeUser(user, "User")), ...legacyUsers.map((user) => normalizeUser(user, "LegacyUser"))].filter((user) => {
      const key = user.clerkId || user.email;
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

const getUserOrderHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user =
      (await User.findOne({ clerkId }).select("-password -__v")) ||
      (await LegacyUser.findOne({ clerkId }).select("-__v"));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [payments, serviceHistory, bookings] = await Promise.all([
      PaymentHistory.find({ clerkId }).sort({ createdAt: -1 }).select("-__v"),
      ServiceHistory.find({ clerkId }).sort({ scheduledDate: -1 }).select("-__v"),
      ServiceRequest.find({ clerkId }).sort({ createdAt: -1 }),
    ]);

    const payload = buildOrderHistory(user, payments, serviceHistory, bookings);

    res.status(200).json({
      message: "User order history fetched successfully",
      ...payload,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// Get single user profile by clerkId
const getUserByClerkId = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

<<<<<<< HEAD
const updateStaffSettings = async (req, res) => {
=======
const updateUserSettings = async (req, res) => {
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
  try {
    const { clerkId } = req.params;
    const {
      firstName,
      lastName,
      availabilityStatus,
<<<<<<< HEAD
      bankAccountName,
      bankName,
      bankAccountNumber,
      bankBranch,
    } = req.body;

    const user = await User.findOne({ clerkId });
    if (!user || user.role !== "Staff") {
      return res.status(404).json({ message: "Staff member not found" });
    }

    const nextFirstName = typeof firstName === "string" ? firstName.trim() : user.firstName;
    const nextLastName = typeof lastName === "string" ? lastName.trim() : user.lastName || "";
    const nextAvailabilityStatus = typeof availabilityStatus === "string" ? availabilityStatus.trim() : user.availabilityStatus || "Available";
=======
      bankDetails,
    } = req.body;

    const user =
      (await User.findOne({ clerkId })) ||
      (await LegacyUser.findOne({ clerkId }));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const nextFirstName = typeof firstName === "string" ? firstName.trim() : user.firstName;
    const nextLastName = typeof lastName === "string" ? lastName.trim() : user.lastName;
    const nextAvailability = typeof availabilityStatus === "string" ? availabilityStatus.trim() : user.availabilityStatus || "Available";
    const nextBankDetails = {
      bankName: typeof bankDetails?.bankName === "string" ? bankDetails.bankName.trim() : user.bankDetails?.bankName || "",
      accountName: typeof bankDetails?.accountName === "string" ? bankDetails.accountName.trim() : user.bankDetails?.accountName || "",
      accountNumber: typeof bankDetails?.accountNumber === "string" ? bankDetails.accountNumber.trim() : user.bankDetails?.accountNumber || "",
      branch: typeof bankDetails?.branch === "string" ? bankDetails.branch.trim() : user.bankDetails?.branch || "",
    };
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51

    if (!nextFirstName) {
      return res.status(400).json({ message: "First name is required" });
    }

<<<<<<< HEAD
    if (!["Available", "Busy", "Unavailable"].includes(nextAvailabilityStatus)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

=======
    if (!['Available', 'Busy', 'Off Duty'].includes(nextAvailability)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    user.firstName = nextFirstName;
    user.lastName = nextLastName;
    user.availabilityStatus = nextAvailability;
    user.bankDetails = nextBankDetails;

    await user.save();

>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
    if (user.clerkId) {
      await clerkClient.users.updateUser(user.clerkId, {
        firstName: nextFirstName,
        lastName: nextLastName || undefined,
      });
    }

<<<<<<< HEAD
    user.firstName = nextFirstName;
    user.lastName = nextLastName;
    user.availabilityStatus = nextAvailabilityStatus;
    user.bankAccountName = typeof bankAccountName === "string" ? bankAccountName.trim() : user.bankAccountName || "";
    user.bankName = typeof bankName === "string" ? bankName.trim() : user.bankName || "";
    user.bankAccountNumber = typeof bankAccountNumber === "string" ? bankAccountNumber.trim() : user.bankAccountNumber || "";
    user.bankBranch = typeof bankBranch === "string" ? bankBranch.trim() : user.bankBranch || "";

    await user.save();

    return res.status(200).json({
      message: "Staff settings updated successfully",
=======
    return res.status(200).json({
      message: "Settings updated successfully",
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
      user,
    });
  } catch (err) {
    console.log(err);
<<<<<<< HEAD
    res.status(500).json({ message: "Internal server Error" });
=======
    return res.status(500).json({ message: "Internal server Error" });
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
  }
};

// // Update profile (name, email, preferences) 
// const updateUser = async (req, res) => {
//   try {
//     const { firstName, lastName, email, preferences } = req.body;
//     const updateData = { firstName, lastName, email, preferences };

//     const updatedUser = await User.findOneAndUpdate(
//       { clerkId: req.params.clerkId },
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

// // Update account status (Admin only)
// const updateUserStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ["Activate", "Suspended", "Banned"];

//     if (!status || !validStatuses.includes(status)) {
//       return res.status(400).json({
//         message: `Status must be one of: ${validStatuses.join(", ")}`,
//       });
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       { clerkId: req.params.clerkId },
//       { $set: { status } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: `Status updated to ${status}`, user: updatedUser });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

// //  Delete user (Admin only)
// const deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.findOneAndDelete({ clerkId: req.params.clerkId });
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: `User ${deletedUser.firstName} deleted successfully` });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };
<<<<<<< HEAD
// module.exports = { createUser, login, getAllUsers, getUserByClerkId, updateUser, updateUserStatus, deleteUser };
module.exports = { createUser, getUserByClerkId, updateStaffSettings };
=======
module.exports = { createUser, getAllUsers, getUserByClerkId, getUserOrderHistory, updateUserSettings };
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
