const express = require("express");
const router = express.Router();
const { authorize } = require('../Middleware/roleCheck');
const { createInquiry } = require("../Controllers/InquiryControl");


const {
  createUser,
  getAllUsers,
  getUserByClerkId,
  getUserOrderHistory,
} = require("../Controllers/UserControl");

router.post("/signup", createUser);
router.post("/inquiries", createInquiry);
// router.post('/check-admin',checkAdmin);
// router.post("/login", login);
router.get("/admin/all", getAllUsers);
router.get("/admin/:clerkId/history", getUserOrderHistory);
router.get("/:clerkId", getUserByClerkId);
// router.put("/:clerkId", updateUser);
// router.patch("/:clerkId/status", updateUserStatus);
// router.delete("/:clerkId", deleteUser);

module.exports = router;