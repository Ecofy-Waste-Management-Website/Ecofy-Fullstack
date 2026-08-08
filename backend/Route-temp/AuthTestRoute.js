const express = require('express');
const router = express.Router();
const { clerkRequireAuth } = require('../Middleware/clerkAuth');

/**
 * GET /auth-test/public
 * A completely open test endpoint — no auth required.
 * Useful to confirm the server is running.
 */
router.get('/public', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Public route is accessible — no auth needed.',
  });
});

/**
 * GET /auth-test/protected
 * Protected by Clerk's ClerkExpressRequireAuth() middleware.
 *
 * - Clerk validates the Bearer token in the Authorization header.
 * - If valid  → req.auth is populated with { userId, sessionId, sessionClaims }
 * - If invalid / missing → Clerk responds with 401 automatically.
 *
 * Test with a valid Clerk session token:
 *   curl -H "Authorization: Bearer <clerk_session_token>" http://localhost:5001/auth-test/protected
 */
router.get('/protected', clerkRequireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: '🔐 Protected route accessed successfully.',
    auth: {
      userId: req.auth.userId,
      sessionId: req.auth.sessionId,
    },
  });
});

module.exports = router;
