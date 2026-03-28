const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getAllUsers,
  getUserByClerkId,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../Controllers/UserControl");

router.post("/signup", createUser);
router.post("/login", login);
router.get("/", getAllUsers);
router.get("/:clerkId", getUserByClerkId);
router.put("/:clerkId", updateUser);
router.patch("/:clerkId/status", updateUserStatus);
router.delete("/:clerkId", deleteUser);

module.exports = router;