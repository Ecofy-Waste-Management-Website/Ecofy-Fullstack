// Controllers/adminController.js
const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../Models/User'); // Update this path to match your actual User model file

const createStaffAccount = async (req, res) => {
  try {
    // 1. Grab the data sent from the React frontend form
    const { firstName, lastName, email, password } = req.body;

    // 2. Basic Validation to ensure no blank fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required to create a staff account.' });
    }

    // 3. STEP ONE: Create the user in Clerk's system
    const clerkUser = await clerkClient.users.createUser({
      firstName: firstName,
      lastName: lastName,
      emailAddress: [email],
      password: password, 
      // Optional: You can tell Clerk directly that this person is staff
      publicMetadata: { role: 'Staff' } 
    });

    // 4. STEP TWO: Save the user in your MongoDB database
    const newStaff = new User({
      clerkId: clerkUser.id,     // This links Clerk and MongoDB together!
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'Staff'              // Hardcoding the role since only admins hit this route
    });

    await newStaff.save();

    // 5. Send a success message back to the frontend
    return res.status(201).json({ 
      message: 'Staff account successfully created!',
      staffId: newStaff._id
    });

  } catch (error) {
    console.error('Error in createStaffAccount:', error);

    // Clerk sends back an array of errors (e.g., "Email already taken", "Password too weak")
    // This catches Clerk's specific errors and sends them cleanly to the frontend
    if (error.errors && error.errors.length > 0) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    // Generic server error fallback
    return res.status(500).json({ message: 'Failed to create staff account. Please try again.' });
  }
};

module.exports = {
  createStaffAccount
};