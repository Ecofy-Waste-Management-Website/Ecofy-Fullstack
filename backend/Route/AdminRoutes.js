const express = require('express');
const {
	createStaffAccount,
	getAllStaffAccounts,
	updateStaffAccount,
	deleteStaffAccount,
} = require('../Controllers/adminController');
const {
	getAllInquiries,
	replyToInquiry,
} = require('../Controllers/InquiryControl');

const router = express.Router();

router.post('/create-staff', createStaffAccount);
router.get('/staff', getAllStaffAccounts);
router.patch('/staff/:id', updateStaffAccount);
router.delete('/staff/:id', deleteStaffAccount);
router.get('/inquiries', getAllInquiries);
router.patch('/inquiries/:id/reply', replyToInquiry);

module.exports = router;
