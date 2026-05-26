const express = require("express");
const router  = express.Router();
const ServiceRequest = require("../Model/ServiceRequestModel");
const Notification = require("../Model/NotificationModel");

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
function toFrontend(doc) {
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
    assignedStaff: doc.assignedStaff,
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
    res.json({ success: true, data: docs.map(toFrontend) });
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
    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: toFrontend(doc) });
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

    const doc = await ServiceRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    // Allow Clerk IDs (they may start with "user_") as well as plain staff names.
    // No special-format rejection here — any string (or null) is accepted.
    if (doc.assignedStaff !== assignedStaff) {
      doc.assignedStaff = assignedStaff || null;
      const event = assignedStaff
        ? `Assigned to ${assignedStaff}`
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

    const payload = toFrontend(doc);
    broadcast(req, { type: "REQUEST_UPDATED", data: payload });
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
