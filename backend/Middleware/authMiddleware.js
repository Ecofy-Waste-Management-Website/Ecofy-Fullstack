const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../Model/User.js');

// 1. CLERK MIDDLEWARE: This automatically grabs the Bearer token, 
// checks it against Clerk's servers, and throws a 401 if it's invalid.
// If valid, it attaches the user's Clerk ID to `req.auth.userId`.
const verifyClerkToken = ClerkExpressRequireAuth();

// 2. MONGODB MIDDLEWARE: Now that Clerk says they are legit, 
// we need to find them in your database so we know their Role.
const attachMongoUser = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId; // The verified Clerk ID

    // Look up the user in MongoDB using their Clerk ID
    // Note: Ensure 'clerkId' matches exactly what you named the field in your User Model
    const user = await User.findOne({ clerkId: clerkId }); 

    if (!user) {
      return res.status(401).json({ message: 'User authenticated with Clerk, but not found in Database' });
    }

    // Attach the MongoDB user to req.user (Just like your old code did!)
    req.user = user;
    next();
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Server error while fetching user details' });
  }
};

// 3. COMBINE THEM: We export them as an array so your route files 
// can just use `isAuthenticated` without changing any code.
const isAuthenticated = [verifyClerkToken, attachMongoUser];

const isAdmin = (req, res, next) => {
  // Now this works perfectly because req.user is loaded from MongoDB!
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Strictly admin access only.' });
  }
};

module.exports = { isAuthenticated, isAdmin };