const express = require("express");
const router = express.Router();
const {
  getStaffProfile,
  getAssignedTasks,
  getActiveTasks,
  getCompletedTasks,
  updateTaskStatus,
} = require("../Controllers/staffController");
const { rejectBannedStaff } = require('../Middleware/staffAccountStatus');

// ── Staff Routes (/api/staff/*) ──────────────────────

// Get staff profile
router.get("/profile/:clerkId", getStaffProfile);

// Get today's assigned tasks
router.get("/tasks/today/:clerkId", rejectBannedStaff, getAssignedTasks);

// Get active tasks (Pending, Assigned, In Progress)
router.get("/tasks/active/:clerkId", rejectBannedStaff, getActiveTasks);

// Get completed tasks
router.get("/tasks/completed/:clerkId", rejectBannedStaff, getCompletedTasks);

// Update task status
router.patch("/tasks/:taskId/status", rejectBannedStaff, updateTaskStatus);

module.exports = router;
