const express = require("express");
const router = express.Router();
const {
  getStaffProfile,
  getAssignedTasks,
  getActiveTasks,
  getCompletedTasks,
  updateTaskStatus,
} = require("../Controllers/staffController");

// ── Staff Routes (/api/staff/*) ──────────────────────

// Get staff profile
router.get("/profile/:clerkId", getStaffProfile);

// Get today's assigned tasks
router.get("/tasks/today/:clerkId", getAssignedTasks);

// Get active tasks (Pending, Assigned, In Progress)
router.get("/tasks/active/:clerkId", getActiveTasks);

// Get completed tasks
router.get("/tasks/completed/:clerkId", getCompletedTasks);

// Update task status
router.patch("/tasks/:taskId/status", updateTaskStatus);

module.exports = router;