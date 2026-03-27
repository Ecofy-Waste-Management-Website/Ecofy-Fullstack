const express = require("express");
const router = express.Router();
const { getPaymentHistory, createPaymentHistory } = require("../Controllers/PaymentHistoryControl");

router.get("/:clerkId", getPaymentHistory);
router.post("/", createPaymentHistory);

module.exports = router;