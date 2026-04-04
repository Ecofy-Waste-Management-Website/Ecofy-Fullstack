import express from 'express';
import { createStaffAccount } from '../Controllers/adminController.js';
import { isAuthenticated, isAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/admin/create-staff
// @desc    Creates a new staff member
// @access  Private/Admin strictly
router.post('/create-staff', isAuthenticated, isAdmin, createStaffAccount);

export default router;
