import bcrypt from 'bcrypt';
import User from '../Model/User.js';

/**
 * @desc    Create a new staff account
 * @route   POST /api/admin/create-staff
 * @access  Private/Admin
 */
export const createStaffAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate inputs
    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (firstName, email, password)' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new staff user
    const staffUser = await User.create({
      firstName,
      lastName: lastName || '',
      email,
      password: hashedPassword,
      role: 'Staff', // Strictly set as Staff
      status: 'Activate'
    });

    if (staffUser) {
      // Securely return response without exposing password
      res.status(201).json({
        message: 'Staff account created successfully',
        staff: {
          _id: staffUser._id,
          firstName: staffUser.firstName,
          lastName: staffUser.lastName,
          email: staffUser.email,
          role: staffUser.role,
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Error creating staff account:', error);
    res.status(500).json({ message: 'Server configuration error encountered', error: error.message });
  }
};
