const User = require('../Model/User');
const LegacyUser = require('../Model/UserModule');

/**
 * Prevent a banned staff member from using staff-only actions. The profile
 * route remains available so the client can show the account-status notice.
 */
const rejectBannedStaff = async (req, res, next) => {
  try {
    const clerkId = req.params.clerkId || req.body?.clerkId;

    if (!clerkId) return next();

    const staff =
      (await User.findOne({ clerkId, role: 'Staff' }).select('status').lean()) ||
      (await LegacyUser.findOne({ clerkId, role: 'Staff' }).select('status').lean());

    if (staff?.status === 'Banned') {
      return res.status(403).json({
        banned: true,
        message: 'Your account is banned. Contact Ecofy Team.',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { rejectBannedStaff };
