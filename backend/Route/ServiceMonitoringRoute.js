const express = require("express");
const router = express.Router();
const ServiceRequest = require("../Model/ServiceRequestModel");
const Notification = require("../Model/NotificationModel");
const User = require("../Model/User");
const { rejectBannedStaff } = require('../Middleware/staffAccountStatus');

// ── Staff Directory Helpers ───────────────────────────────────────────────────
async function buildStaffDirectory() {
  const staffDirectory = new Map();
  try {
    const allUsers = await User.find().lean();
    for (const staff of allUsers) {
      const label = [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim() || staff.firstName || staff.username || staff.email;
      const cleanLabel = (label && !label.startsWith("user_")) ? label : "Staff Member";
      const entry = {
        value: staff.clerkId || staff._id.toString(),
        label: cleanLabel,
        email: staff.email,
        clerkId: staff.clerkId,
      };
      if (staff.clerkId) staffDirectory.set(staff.clerkId, entry);
      if (staff._id) staffDirectory.set(staff._id.toString(), entry);
      if (staff.email) staffDirectory.set(staff.email, entry);
    }
  } catch (err) {
    console.error("Error building staff directory:", err);
  }
  return staffDirectory;
}

function resolveAssignedStaff(directory, value) {
  if (!value) return null;
  if (directory.has(value)) {
    const found = directory.get(value);
    if (found.label && !found.label.startsWith("user_")) {
      return found;
    }
  }
  if (typeof value === "string" && value.startsWith("user_")) {
    return { value, label: "Staff Member" };
  }
  return { value, label: value };
}

// ── Broadcast helper ──────────────────────────────────────────────────────────
// Sends a WebSocket message to every connected dashboard client.
// wss is attached to app in app.js so all routers can reach it.
function broadcast(req, payload) {
  const wss = req.app.get("wss");
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1 /* OPEN */) client.send(msg);
  });
}

// ── Map DB document → frontend shape ─────────────────────────────────────────
// Keeps the frontend free from knowing internal field names.
function toFrontend(doc, staffDirectory = new Map()) {
  if (!doc) return {};
  const assignedStaff = doc.assignedStaff || null;
  const resolvedStaff = resolveAssignedStaff(staffDirectory, assignedStaff);
  const docIdStr = doc._id ? doc._id.toString() : String(Math.random());

  return {
    id: doc._id || docIdStr,
    requestId: `#REQ-${docIdStr.slice(-5).toUpperCase()}`,
    customer: doc.customer_name || "Customer",
    email: doc.customer_email || "",
    customer_phone: doc.customer_phone || "",
    location: doc.location || "N/A",
    type: doc.service_type || "General",
    wasteCategory: doc.waste_category || "General",
    servicePrice: doc.servicePrice || 0,
    pickupPin: doc.pickupPin || "",
    status: doc.status || "Pending",
    assignedStaff,
    assignedStaffLabel: resolvedStaff?.label || assignedStaff || null,
    assignedStaffValue: resolvedStaff?.value || assignedStaff || null,
    submittedAt: doc.createdAt || new Date(),
    scheduledDate: doc.scheduled_date || new Date(),
    notes: doc.notes || "",
    timeline: Array.isArray(doc.timeline) ? doc.timeline : [],
  };
}

// ── GET /service-monitoring ───────────────────────────────────────────────────
// Returns all requests with optional filtering.
// Query params: status, type, location, search
router.get("/", async (req, res) => {
  try {
    const staffDirectory = await buildStaffDirectory();
    const { status, type, location, search } = req.query;
    const filter = {};

    if (status && status !== "All") filter.status = status;
    if (type && type !== "All") filter.service_type = type;
    if (location && location !== "All") filter.location = location;

    // Search across customer name, email, and location
    // Uses $and so search doesn't override status/type/location filters
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$and = [
        {
          $or: [
            { customer_name: regex },
            { customer_email: regex },
            { location: regex },
          ]
        },
      ];
    }

    const docs = await ServiceRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: docs.map((doc) => toFrontend(doc, staffDirectory)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /service-monitoring/stats ────────────────────────────────────────────
// KPI counts — used by the KPIGrid component.
router.get("/stats", async (req, res) => {
  try {
    const [total, pending, assigned, inProgress, completed, delayed] =
      await Promise.all([
        ServiceRequest.countDocuments(),
        ServiceRequest.countDocuments({ status: "Pending" }),
        ServiceRequest.countDocuments({ status: "Assigned" }),
        ServiceRequest.countDocuments({ status: "In Progress" }),
        ServiceRequest.countDocuments({ status: "Completed" }),
        ServiceRequest.countDocuments({ status: "Delayed" }),
      ]);

    res.json({
      success: true,
      data: { total, pending, assigned, inProgress, completed, delayed },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /service-monitoring/:id ───────────────────────────────────────────────
// Single request — opened when the modal loads.
router.get("/:id", async (req, res) => {
  try {
    const staffDirectory = await buildStaffDirectory();
    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: toFrontend(doc, staffDirectory) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /service-monitoring/:id/status ─────────────────────────────────────
// Updates status + appends a timeline event + broadcasts via WebSocket.
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Assigned", "In Progress", "Completed", "Delayed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    if (doc.status !== status) {
      doc.status = status;
      doc.timeline.push({ event: `Status changed to ${status}`, time: new Date() });
      await doc.save();
    }

    const payload = toFrontend(doc);
    broadcast(req, { type: "REQUEST_UPDATED", data: payload });
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /service-monitoring/:id/assign ─────────────────────────────────────
// Assigns or unassigns a staff member + appends timeline + broadcasts.
router.patch("/:id/assign", async (req, res) => {
  try {
    const { assignedStaff } = req.body; // pass null to unassign
    const staffDirectory = await buildStaffDirectory();

    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    const resolvedStaff = assignedStaff ? resolveAssignedStaff(staffDirectory, assignedStaff) : null;

    if (assignedStaff && !resolvedStaff) {
      return res.status(400).json({ success: false, message: "Assigned staff must match a real staff account" });
    }

    const nextAssignedStaff = resolvedStaff ? resolvedStaff.value : null;

    if (doc.assignedStaff !== nextAssignedStaff) {
      doc.assignedStaff = nextAssignedStaff;
      const event = assignedStaff
        ? `Assigned to ${resolvedStaff.label}`
        : "Staff unassigned";
      doc.timeline.push({ event, time: new Date() });

      if (assignedStaff && doc.clerkId) {
        await Notification.create({
          clerkId: doc.clerkId,
          title: "Pickup Confirmed",
          message: "Your pickup order has been confirmed by staff. We are on the way.",
          type: "Success",
          target: "user",
          relatedService: null,
        });
      }

      await doc.save();
    }

    const payload = toFrontend(doc, staffDirectory);
    broadcast(req, { type: "REQUEST_UPDATED", data: payload });
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /service-monitoring/:id/cancel ─────────────────────────────────────
// Cancels a staff pickup, returns it to pending, and notifies the customer.
router.patch("/:id/cancel", rejectBannedStaff, async (req, res) => {
  try {
    const { clerkId } = req.body;
    const staffDirectory = await buildStaffDirectory();

    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    if (clerkId && doc.assignedStaff && doc.assignedStaff !== clerkId) {
      return res.status(403).json({ success: false, message: "You can only cancel your own assigned pickup" });
    }

    doc.assignedStaff = null;
    doc.status = "Pending";
    doc.timeline.push({ event: "Pickup cancelled by staff and returned to pending orders", time: new Date() });
    await doc.save();

    if (doc.clerkId) {
      await Notification.create({
        clerkId: doc.clerkId,
        title: "Pickup Cancelled",
        message: "Your pickup order was cancelled by staff and returned to pending orders.",
        type: "Warning",
        target: "user",
        relatedService: null,
      });
    }

    const payload = toFrontend(doc, staffDirectory);
    broadcast(req, { type: "REQUEST_UPDATED", data: payload });
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
