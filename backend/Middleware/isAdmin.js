// Assuming you already have middleware verifying a JWT and attaching req.user
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin strictly only.' });
  }
};
module.exports = isAdmin;