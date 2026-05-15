const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  replyToInquiry,
} = require("../Controllers/InquiryControl");

router.post("/", createInquiry);
router.get("/", getAllInquiries);
router.put("/:id/reply", replyToInquiry);

module.exports = router;