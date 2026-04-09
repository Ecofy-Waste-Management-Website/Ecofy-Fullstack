const bcrypt = require('bcrypt');
const User = require('../Model/User.js');

const createStaffAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (firstName, email, password)' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staffUser = await User.create({
      firstName,
      lastName: lastName || '',
      email,
      password: hashedPassword,
      role: 'Staff',
      status: 'Activate'
    });

    if (staffUser) {
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

module.exports = { createStaffAccount };
