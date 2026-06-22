const User = require('../Model/User.js');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const getClerkErrorMessage = (error) => {
  if (error?.errors?.[0]?.longMessage) return error.errors[0].longMessage;
  if (error?.errors?.[0]?.message) return error.errors[0].message;
  return error?.message || 'Unknown Clerk error';
};

const getClerkErrorStatus = (error) => {
  if (typeof error?.status === 'number') return error.status;
  if (typeof error?.statusCode === 'number') return error.statusCode;
  return 500;
};

const toDisplayStatus = (status) => {
  return status === 'Activate' ? 'Active' : 'Inactive';
};

const mapStaffForResponse = (staffUser) => ({
  _id: staffUser._id,
  clerkId: staffUser.clerkId,
  firstName: staffUser.firstName,
  username: staffUser.username,
  lastName: staffUser.lastName,
  email: staffUser.email,
  role: staffUser.role,
  status: staffUser.status,
  displayStatus: toDisplayStatus(staffUser.status),
  mustChangePassword: Boolean(staffUser.mustChangePassword),
  passwordChangedAt: staffUser.passwordChangedAt,
  createdAt: staffUser.createdAt,
  updatedAt: staffUser.updatedAt,
});

const createStaffAccount = async (req, res) => {
  let createdClerkUserId = null;

  try {
    const { firstName, username, lastName, email, password } = req.body;
    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!process.env.CLERK_SECRET_KEY && !process.env.CLERK_API_KEY) {
      return res.status(500).json({
        message: 'Clerk is not configured on the server. Missing CLERK_SECRET_KEY.',
      });
    }

    if (!firstName || !normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (firstName, username, email, password)' });
    }

    if (!/^[a-z0-9_.-]{3,30}$/.test(normalizedUsername)) {
      return res.status(400).json({
        message: 'Username must be 3-30 characters and can contain lowercase letters, numbers, underscore, dot, or hyphen.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const userExists = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (userExists) {
      if (userExists.email === normalizedEmail) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      return res.status(400).json({ message: 'This username is already taken' });
    }

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [normalizedEmail],
      username: normalizedUsername,
      password,
      firstName,
      lastName: lastName || undefined,
      publicMetadata: { role: 'Staff', mustChangePassword: true },
    });

    createdClerkUserId = clerkUser.id;

    const staffUser = await User.create({
      _id: createdClerkUserId,
      clerkId: createdClerkUserId,
      firstName,
      username: normalizedUsername,
      lastName: lastName || '',
      email: normalizedEmail,
      role: 'Staff',
      status: 'Activate',
      mustChangePassword: true,
    });

    console.log('Staff account created successfully', {
      id: staffUser._id.toString(),
      clerkId: staffUser.clerkId,
      email: staffUser.email,
      username: staffUser.username,
    });

    return res.status(201).json({
      message: 'Staff account created successfully',
      staff: {
        _id: staffUser._id,
        clerkId: staffUser.clerkId,
        firstName: staffUser.firstName,
        username: staffUser.username,
        lastName: staffUser.lastName,
        email: staffUser.email,
        role: staffUser.role,
        status: staffUser.status,
        mustChangePassword: staffUser.mustChangePassword,
      }
    });
  } catch (error) {
    // If Clerk user was created but Mongo save failed, clean up the orphaned Clerk account.
    if (createdClerkUserId) {
      try {
        await clerkClient.users.deleteUser(createdClerkUserId);
      } catch (rollbackError) {
        console.error('Rollback failed: Could not delete orphaned Clerk user:', rollbackError);
      }

      return res.status(500).json({
        message: 'Staff user created in Clerk, but database save failed. Rolled back Clerk user.',
        error: error.message,
      });
    }

    console.error('Error creating staff account:', error);

    const clerkErrorMessage = getClerkErrorMessage(error);
    const statusCode = getClerkErrorStatus(error);

    return res.status(statusCode).json({
      message: `Failed to create staff account in Clerk: ${clerkErrorMessage}`,
      error: clerkErrorMessage,
    });
  }
};

const getAllStaffAccounts = async (_req, res) => {
  try {
    const staffUsers = await User.find({ role: 'Staff' })
      .sort({ createdAt: -1 })
      .select('clerkId firstName username lastName email role status mustChangePassword passwordChangedAt createdAt updatedAt');

    console.log('Staff accounts fetched successfully', { count: staffUsers.length });

    return res.status(200).json({
      message: 'Staff accounts fetched successfully',
      staff: staffUsers.map(mapStaffForResponse),
    });
  } catch (error) {
    console.error('Error fetching staff accounts:', error);
    return res.status(500).json({
      message: 'Failed to fetch staff accounts.',
      error: error.message,
    });
  }
};

const updateStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, status } = req.body;

    const staffUser = await User.findById(id);

    if (!staffUser || staffUser.role !== 'Staff') {
      return res.status(404).json({ message: 'Staff account not found' });
    }

    const nextFirstName = firstName?.trim() || staffUser.firstName;
    const nextLastName = typeof lastName === 'string' ? lastName.trim() : staffUser.lastName;
    const nextEmail = email?.trim().toLowerCase() || staffUser.email;
    const nextRole = role?.trim() || staffUser.role;
    const nextStatus = status?.trim() || staffUser.status;

    if (!nextFirstName || !nextEmail) {
      return res.status(400).json({ message: 'firstName and email are required' });
    }

    if (nextRole !== 'Staff') {
      return res.status(400).json({ message: 'Only Staff role updates are supported in this module' });
    }

    if (!['Activate', 'Suspended', 'Banned'].includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (nextEmail !== staffUser.email) {
      return res.status(400).json({
        message: 'Email changes are not supported from this endpoint. Update email directly in Clerk and then sync MongoDB.',
      });
    }

    if (staffUser.clerkId) {
      await clerkClient.users.updateUser(staffUser.clerkId, {
        firstName: nextFirstName,
        lastName: nextLastName || undefined,
      });
    }

    staffUser.firstName = nextFirstName;
    staffUser.lastName = nextLastName;
    staffUser.email = nextEmail;
    staffUser.role = 'Staff';
    staffUser.status = nextStatus;

    await staffUser.save();

    console.log('Staff account updated successfully', {
      id: staffUser._id.toString(),
      clerkId: staffUser.clerkId,
      email: staffUser.email,
      status: staffUser.status,
    });

    return res.status(200).json({
      message: 'Staff account updated successfully',
      staff: mapStaffForResponse(staffUser),
    });
  } catch (error) {
    console.error('Error updating staff account:', error);
    return res.status(500).json({
      message: 'Failed to update staff account.',
      error: getClerkErrorMessage(error),
    });
  }
};

const deleteStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const staffUser = await User.findById(id);

    if (!staffUser || staffUser.role !== 'Staff') {
      return res.status(404).json({ message: 'Staff account not found' });
    }

    if (staffUser.clerkId) {
      await clerkClient.users.deleteUser(staffUser.clerkId);
    }

    await User.findByIdAndDelete(id);

    console.log('Staff account deleted successfully', {
      id,
      clerkId: staffUser.clerkId,
      email: staffUser.email,
      username: staffUser.username,
    });

    return res.status(200).json({
      message: 'Staff account deleted successfully',
      deletedStaffId: id,
    });
  } catch (error) {
    console.error('Error deleting staff account:', error);
    return res.status(500).json({
      message: 'Failed to delete staff account.',
      error: getClerkErrorMessage(error),
    });
  }
};

module.exports = {
  createStaffAccount,
  getAllStaffAccounts,
  updateStaffAccount,
  deleteStaffAccount,
};
