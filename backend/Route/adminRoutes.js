const express = require('express');
const { createStaffAccount } = require('../Controllers/adminController');

const router = express.Router();

router.post('/create-staff', createStaffAccount);

module.exports = router;
