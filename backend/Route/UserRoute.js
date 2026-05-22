const express = require("express");
const router = express.Router();
const { authorize } = require('../Middleware/roleCheck');
const { createInquiry } = require("../Controllers/InquiryControl");


const {
  createUser,
  getUserByClerkId,
  updateStaffSettings,
} = require("../Controllers/UserControl");

router.post("/signup", createUser);
router.post("/inquiries", createInquiry);
// router.post('/check-admin',checkAdmin);
// router.post("/login", login);
// router.get("/", getAllUsers);
router.get("/:clerkId", getUserByClerkId);
router.patch("/:clerkId/settings", updateStaffSettings);
// router.put("/:clerkId", updateUser);
// router.patch("/:clerkId/status", updateUserStatus);
// router.delete("/:clerkId", deleteUser);

module.exports = router;