import jwt from 'jsonwebtoken';
import User from '../Model/User.js';

/**
 * Middleware to check if the incoming request has a valid JWT token
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

    // Fetch user from DB and attach to req
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

/**
 * Middleware to strictly check if the authenticated user is an Admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Strictly admin access only.' });
  }
};
