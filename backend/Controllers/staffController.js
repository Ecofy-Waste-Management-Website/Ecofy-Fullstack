const User = require("../Model/UserModule");
const ServiceRequest = require("../Model/ServiceRequestModel");
const Notification = require("../Model/NotificationModel");
<<<<<<< HEAD

const SERVICE_PRICES = {
  Household: 1500,
  Commercial: 3500,
  Bulk: 2500,
  Garden: 1200,
  "Drain Cleaning": 2000,
};

function broadcast(req, payload) {
  const wss = req.app.get("wss");
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}
=======
>>>>>>> 82531a44c1376e2b94d39bfb7bae5901e89b6d51

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
    const task = await ServiceRequest.findOne({
      _id: taskId,
      assignedStaff: clerkId,
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

      if (task.clerkId) {
        await Notification.create({
          clerkId: task.clerkId,
          title: "Pickup Completed",
          message: "Your pickup has been completed successfully.",
          type: "Success",
          target: "user",
          relatedService: task._id,
        });
      }
    }

    if (status === "Assigned" && task.clerkId) {
      const price = SERVICE_PRICES[task.service_type] || task.estimated_amt || 0;
      const notification = await Notification.create({
        clerkId: task.clerkId,
        title: "Pickup Confirmed",
        message: `Pickup confirmed for Order ${task._id}. PIN: ${task.pickupPin || "N/A"}. Price: LKR ${Number(price).toLocaleString()}. The crew is on the way.`,
        type: "Info",
        target: "user",
        relatedService: task._id,
      });

      broadcast(req, {
        type: "NOTIFICATION_CREATED",
        data: {
          clerkId: notification.clerkId,
          target: notification.target,
          notification: notification.toObject ? notification.toObject() : notification,
        },
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