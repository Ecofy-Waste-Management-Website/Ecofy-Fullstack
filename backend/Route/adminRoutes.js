const express = require('express');
const { createStaffAccount } = require('../Controllers/adminController');
const {
	getAllInquiries,
	replyToInquiry,
} = require('../Controllers/InquiryControl');

const router = express.Router();

router.post('/create-staff', createStaffAccount);
router.get('/inquiries', getAllInquiries);
router.patch('/inquiries/:id/reply', replyToInquiry);

module.exports = router;
