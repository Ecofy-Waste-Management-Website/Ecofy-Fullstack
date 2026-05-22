const User = require("../Model/UserModule");
const { clerkClient } = require("@clerk/clerk-sdk-node");

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
    res.status(201).json({ message: "New User created Successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "debug : Internal server Error" });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found!" });
//     }
//     res.status(200).json({ message: "Login successful", user });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

// // Get all users (Admin dashboard)
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-__v");
//     res.status(200).json({ message: "Users fetched successfully", users });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server Error" });
//   }
// };

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

const updateStaffSettings = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const {
      firstName,
      lastName,
      availabilityStatus,
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

    if (!nextFirstName) {
      return res.status(400).json({ message: "First name is required" });
    }

    if (!["Available", "Busy", "Unavailable"].includes(nextAvailabilityStatus)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    if (user.clerkId) {
      await clerkClient.users.updateUser(user.clerkId, {
        firstName: nextFirstName,
        lastName: nextLastName || undefined,
      });
    }

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
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
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
// module.exports = { createUser, login, getAllUsers, getUserByClerkId, updateUser, updateUserStatus, deleteUser };
module.exports = { createUser, getUserByClerkId, updateStaffSettings };