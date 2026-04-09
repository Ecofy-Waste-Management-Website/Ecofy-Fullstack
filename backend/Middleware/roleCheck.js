/**
 * authorize(roles)
 * ----------------
 * Role-based access control middleware.
 * Must be used AFTER clerkRequireAuth so that req.auth is populated.
 *
 * Reads the user's role from Clerk's session claims (set via Clerk's
 * publicMetadata or sessionClaims on your Clerk dashboard).
 *
 * Usage:
 *   router.get('/admin-only', clerkRequireAuth, authorize(['admin']), handler);
 *
 * @param {string[]} roles - Array of allowed roles, e.g. ['admin', 'staff']
 */
const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.auth?.sessionClaims?.metadata?.role || 'user';

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authorize };