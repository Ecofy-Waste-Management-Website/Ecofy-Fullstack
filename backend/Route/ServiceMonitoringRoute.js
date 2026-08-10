const express = require("express");
const router  = express.Router();
const ServiceRequest = require("../Model/ServiceRequestModel");
const Notification = require("../Model/NotificationModel");
const User = require("../Model/User.js");

const normalizeKey = (value) => String(value || "").trim().toLowerCase();

async function buildStaffDirectory() {
  const staffUsers = await User.find({ role: "Staff" })
    .select("clerkId firstName lastName username email")
    .lean();

  const directory = new Map();

  for (const staff of staffUsers) {
    const fullName = [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim();
    const aliases = [
      staff.clerkId,
      staff.username,
      staff.email,
      fullName,
      normalizeKey(fullName),
      normalizeKey(staff.username),
      normalizeKey(staff.email),
      normalizeKey(staff.clerkId),
    ].filter(Boolean);

    for (const alias of aliases) {
      if (!directory.has(alias)) {
        directory.set(alias, {
          value: staff.clerkId || staff.username || staff.email,
          label: fullName || staff.username || staff.email || staff.clerkId,
        });
      }
    }
  }

  return directory;
}

function resolveAssignedStaff(directory, value) {
  if (!value) return null;
  const direct = directory.get(value) || directory.get(normalizeKey(value));
  return direct || null;
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
  const assignedStaff = doc.assignedStaff;
  const resolvedStaff = resolveAssignedStaff(staffDirectory, assignedStaff);

  return {
    id:            doc._id,           // frontend uses _id for PATCH calls
    requestId:     `#REQ-${doc._id.toString().slice(-5).toUpperCase()}`,
    customer:      doc.customer_name,
    email:         doc.customer_email,
    customer_phone: doc.customer_phone,
    location:      doc.location,
    type:          doc.service_type,
    wasteCategory: doc.waste_category,
    servicePrice:  doc.servicePrice,
    pickupPin:     doc.pickupPin,
    status:        doc.status,
    assignedStaff,
    assignedStaffLabel: resolvedStaff?.label || assignedStaff || null,
    assignedStaffValue: resolvedStaff?.value || assignedStaff || null,
    submittedAt:   doc.createdAt,
    scheduledDate: doc.scheduled_date,
    notes:         doc.notes,
    timeline:      doc.timeline,
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

    if (status   && status   !== "All") filter.status       = status;
    if (type     && type     !== "All") filter.service_type = type;
    if (location && location !== "All") filter.location     = location;

    // Search across customer name, email, and location
    // Uses $and so search doesn't override status/type/location filters
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$and = [
        { $or: [
          { customer_name:  regex },
          { customer_email: regex },
          { location:       regex },
        ]},
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
router.patch("/:id/cancel", async (req, res) => {
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
