const User = require("../Model/User.js");
const LegacyUser = require("../Model/UserModule");
const ServiceRequest = require("../Model/ServiceRequestModel");

// ── Get staff profile ────────────────────────────────
const getStaffProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const staff =
      (await User.findOne({ clerkId, role: "Staff" })) ||
      (await LegacyUser.findOne({ clerkId, role: "Staff" }));

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff profile fetched", data: staff });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// ── Get today's assigned tasks for a staff member ────
const getAssignedTasks = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Allow tasks where assignedStaff is either the clerkId or the staff display name
    const staffRecord = (await User.findOne({ clerkId, role: 'Staff' })) || (await LegacyUser.findOne({ clerkId, role: 'Staff' }));
    const staffName = staffRecord ? `${staffRecord.firstName || ''} ${staffRecord.lastName || ''}`.trim() : null;

    const matchAssigned = staffName ? { $in: [clerkId, staffName] } : clerkId;

    const tasks = await ServiceRequest.find({
      assignedStaff: matchAssigned,
      scheduled_date: { $gte: today, $lt: tomorrow },
    }).sort({ scheduled_date: 1 });

    res.status(200).json({
      message: "Tasks fetched successfully",
      total: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// ── Get all assigned tasks (active) ─────────────────
const getActiveTasks = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const staffRecord = (await User.findOne({ clerkId, role: 'Staff' })) || (await LegacyUser.findOne({ clerkId, role: 'Staff' }));
    const staffName = staffRecord ? `${staffRecord.firstName || ''} ${staffRecord.lastName || ''}`.trim() : null;
    const matchAssigned = staffName ? { $in: [clerkId, staffName] } : clerkId;

    const tasks = await ServiceRequest.find({
      assignedStaff: matchAssigned,
      status: { $in: ["Pending", "Assigned", "In Progress", "En Route"] },
    }).sort({ scheduled_date: 1 });

    res.status(200).json({
      message: "Active tasks fetched",
      total: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// ── Get completed tasks ──────────────────────────────
const getCompletedTasks = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const staffRecord = (await User.findOne({ clerkId, role: 'Staff' })) || (await LegacyUser.findOne({ clerkId, role: 'Staff' }));
    const staffName = staffRecord ? `${staffRecord.firstName || ''} ${staffRecord.lastName || ''}`.trim() : null;
    const matchAssigned = staffName ? { $in: [clerkId, staffName] } : clerkId;

    const tasks = await ServiceRequest.find({
      assignedStaff: matchAssigned,
      status: "Completed",
    }).sort({ scheduled_date: -1 });

    res.status(200).json({
      message: "Completed tasks fetched",
      total: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};
// ── Broadcast helper ─────────────────────────────────
function broadcast(req, payload) {
  const wss = req.app.get("wss");
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

// ── Update task status ───────────────────────────────
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, clerkId } = req.body;

    // ── Validate status value ────────────────────────
    const validStatuses = ["Pending", "Assigned", "In Progress", "En Route", "Completed", "Delayed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ── Find task and verify ownership ───────────────
    // Allow ownership if assignedStaff stored as clerkId or as the staff's display name
    const staffRecord = (await User.findOne({ clerkId, role: 'Staff' })) || (await LegacyUser.findOne({ clerkId, role: 'Staff' }));
    const staffName = staffRecord ? `${staffRecord.firstName || ''} ${staffRecord.lastName || ''}`.trim() : null;

    const assignedMatch = staffName ? { $in: [clerkId, staffName] } : clerkId;

    const task = await ServiceRequest.findOne({
      _id: taskId,
      assignedStaff: assignedMatch,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not assigned to you",
      });
    }

    // ── Validate status transition order ─────────────
    const statusOrder = {
      "Pending": 0,
      "Assigned": 1,
      "In Progress": 2,
      "En Route": 3,
      "Completed": 4,
      "Delayed": 2,
    };

    const currentStatusLevel = statusOrder[task.status] || 0;
    const newStatusLevel = statusOrder[status] || 0;

    // Cannot go backwards (except to Delayed)
    if (status !== "Delayed" && newStatusLevel < currentStatusLevel) {
      return res.status(400).json({
        message: `Cannot change status from "${task.status}" back to "${status}"`,
      });
    }

    // Cannot mark Completed without being En Route first
    if (status === "Completed" && 
        task.status !== "En Route" && 
        task.status !== "In Progress") {
      return res.status(400).json({
        message: "Task must be En Route or In Progress before marking as Completed",
      });
    }

    // ── Update status ────────────────────────────────
    task.status = status;

    // ── Log to timeline ──────────────────────────────
    task.timeline.push({
      event: `Status changed to ${status}`,
      time: new Date(),
    });

    // ── Add completedAt timestamp ────────────────────
    if (status === "Completed") {
      task.completedAt = new Date();
      task.timeline.push({
        event: "Task completed by staff",
        time: new Date(),
      });
    }

    await task.save();
 // ── Broadcast to Admin dashboard via WebSocket ───
    broadcast(req, {
      type: "REQUEST_UPDATED",
      data: {
        id: task._id,
        status: task.status,
        timeline: task.timeline,
        assignedStaff: task.assignedStaff,
        completedAt: task.completedAt,
      }
    });
    res.status(200).json({
      message: `Task status updated to ${status}`,
      data: task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

module.exports = {
  getStaffProfile,
  getAssignedTasks,
  getActiveTasks,
  getCompletedTasks,
  updateTaskStatus,
};