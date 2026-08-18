const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getMyInquiries,
  replyToInquiry,
} = require("../Controllers/InquiryControl");

router.post("/", createInquiry);
router.get("/", getAllInquiries);
router.get("/mine", getMyInquiries);
router.put("/:id/reply", replyToInquiry);

module.exports = router;