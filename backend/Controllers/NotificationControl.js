const Notification = require("../Model/NotificationModel");

// GET /notifications/:clerkId
const getNotifications = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { target } = req.query;
    const filter = target === "admin"
      ? { target: "admin" }
      : { clerkId, ...(target ? { target } : {}) };
    const records = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      message: "Notifications fetched successfully",
      count: records.length,
      notifications: records,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /notifications/:id/read  — mark a single notification as read
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { $set: { isRead: true } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification marked as read", notification: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /notifications/:clerkId/read-all  — mark all as read for a user
const markAllAsRead = async (req, res) => {
  try {
    const { clerkId } = req.params;
    await Notification.updateMany({ clerkId, isRead: false }, { $set: { isRead: true } });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /notifications (create — for admin/system use)
const createNotification = async (req, res) => {
  try {
    const record = new Notification(req.body);
    await record.save();
    res.status(201).json({ message: "Notification created", notification: record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };