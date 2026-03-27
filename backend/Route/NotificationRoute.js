const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} = require("../Controllers/NotificationControl");

router.get("/:clerkId", getNotifications);
router.patch("/:id/read", markAsRead);
router.post("/", createNotification);

module.exports = router;