const express = require('express');
const { createStaffAccount } = require('../Controllers/adminController.js');
const { isAuthenticated, isAdmin } = require('../Middleware/authMiddleware.js');
const contentBlogRouter = require('./ContentBlogRoute.js');

const router = express.Router();

// @route   POST /admin/create-staff
// @desc    Creates a new staff member
// @access  Private/Admin strictly
router.post('/create-staff', isAuthenticated, isAdmin, createStaffAccount);

router.use('/blog-posts', contentBlogRouter);

module.exports = router;
