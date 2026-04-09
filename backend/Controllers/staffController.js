const User = require("../Model/UserModule");
const ServiceRequest = require("../Model/ServiceRequestModel");

// ── Get staff profile ────────────────────────────────
const getStaffProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const staff = await User.findOne({ clerkId, role: "Staff" });
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

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await ServiceRequest.find({
      assignedStaff: clerkId,
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
    const tasks = await ServiceRequest.find({
      assignedStaff: clerkId,
      status: { $in: ["Pending", "Assigned", "In Progress"] },
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
    const tasks = await ServiceRequest.find({
      assignedStaff: clerkId,
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

// ── Update task status ───────────────────────────────
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, clerkId } = req.body;

    const validStatuses = ["Pending", "Assigned", "In Progress", "En Route", "Completed", "Delayed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }
    const task = await ServiceRequest.findOne({
      _id: taskId,
      assignedStaff: clerkId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not assigned to you",
      });
    }

    task.status = status;
       task.timeline.push({
      event: `Status changed to ${status}`,
      time: new Date(),
    });
    if (status === "Completed") {
      task.completedAt = new Date();
      task.timeline.push({
        event: "Task completed by staff",
        time: new Date(),
        });
    }
    await task.save();

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