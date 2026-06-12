const express = require("express");
const router = express.Router();
const { authorize } = require('../Middleware/roleCheck');
const { createInquiry } = require("../Controllers/InquiryControl");


const {
  createUser,
  getAllUsers,
  getUserByClerkId,
<<<<<<< HEAD
  updateStaffSettings,
=======
  getUserOrderHistory,
  updateUserSettings,
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51
} = require("../Controllers/UserControl");

router.post("/signup", createUser);
router.post("/inquiries", createInquiry);
// router.post('/check-admin',checkAdmin);
// router.post("/login", login);
router.get("/admin/all", getAllUsers);
router.get("/admin/:clerkId/history", getUserOrderHistory);
router.put("/:clerkId/settings", updateUserSettings);
router.get("/:clerkId", getUserByClerkId);
router.patch("/:clerkId/settings", updateStaffSettings);
// router.put("/:clerkId", updateUser);
// router.patch("/:clerkId/status", updateUserStatus);
// router.delete("/:clerkId", deleteUser);

module.exports = router;