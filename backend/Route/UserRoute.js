const express = require("express");
const router = express.Router();
const { authorize } = require('../Middleware/roleCheck');


const {
  createUser,
  getUserByClerkId,
} = require("../Controllers/UserControl");

router.post("/signup", createUser);
// router.post('/check-admin',checkAdmin);
// router.post("/login", login);
// router.get("/", getAllUsers);
router.get("/:clerkId", getUserByClerkId);
// router.put("/:clerkId", updateUser);
// router.patch("/:clerkId/status", updateUserStatus);
// router.delete("/:clerkId", deleteUser);

module.exports = router;