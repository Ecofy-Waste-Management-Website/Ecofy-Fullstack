const { getAuth } = require('@clerk/express');

/**
 * clerkRequireAuth
 * ----------------
 * Custom Express middleware using Clerk's getAuth() (v1+).
 * Reads the session parsed by clerkMiddleware() and rejects
 * unauthenticated requests with a clean 401 JSON response
 * — ideal for REST API routes.
 *
 * On success  → calls next(); req.auth has { userId, sessionId, sessionClaims }
 * On failure  → returns 401 JSON (not a redirect)
 *
 * REQUIRES: clerkMiddleware() registered globally in app.js before this runs.
 *
 * Usage:
 *   router.get('/protected', clerkRequireAuth, handlerFn);
 */
const clerkRequireAuth = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '🔒 Unauthorized: A valid Clerk session token is required.',
    });
  }

  // Inject the auth object into the request so downstream routes can access it
  req.auth = getAuth(req);

  next();
};

module.exports = { clerkRequireAuth };
