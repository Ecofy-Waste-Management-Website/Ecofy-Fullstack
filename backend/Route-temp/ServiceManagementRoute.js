const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ── Inline Schema ─────────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, enum: ["Residential", "Industrial", "Eco", "Commercial"], default: "Residential" },
    price:       { type: Number, required: true, min: 0 },
    unit:        { type: String, required: true, enum: ["per visit", "per load", "per ton", "per consignment", "per month"], default: "per visit" },
    status:      { type: String, enum: ["Active", "Inactive"], default: "Active" },
    // FIX #6: trim description to reduce XSS surface; sanitize in your view layer too
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

// ── Map DB document → frontend shape ─────────────────────────────────────────
function toFrontend(doc) {
  return {
    id:          doc._id,
    name:        doc.name,
    category:    doc.category,
    price:       doc.price,
    unit:        doc.unit,
    status:      doc.status,
    description: doc.description,
    createdAt:   doc.createdAt,
    updatedAt:   doc.updatedAt,
  };
}

// ── GET /services ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category && category !== "All") filter.category = category;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const docs = await Service.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: docs.map(toFrontend) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /services/stats ───────────────────────────────────────────────────────
// FIX #1: moved ABOVE /:id so "stats" is not swallowed as a Mongo ObjectId
router.get("/stats", async (req, res) => {
  try {
    const [total, active, inactive] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ status: "Active" }),
      Service.countDocuments({ status: "Inactive" }),
    ]);

    const categories = await Service.distinct("category");

    res.json({ success: true, data: { total, active, inactive, categories: categories.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /services/:id ─────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: toFrontend(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /services ────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, category, price, unit, status, description } = req.body;

    if (!name?.trim()) return res.status(400).json({ success: false, message: "Service name is required" });
    if (price == null || price < 0) return res.status(400).json({ success: false, message: "Valid price is required" });

    const doc = await Service.create({
      name:        name.trim(),
      category,
      price:       Number(price),
      unit,
      status:      status || "Active",
      description: description?.trim() || "",
    });
    res.status(201).json({ success: true, data: toFrontend(doc) });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /services/:id ───────────────────────────────────────────────────────
router.patch("/:id", async (req, res) => {
  try {
    const { name, category, price, unit, status, description } = req.body;

    const update = {};
    if (name        !== undefined) update.name        = name.trim();
    if (category    !== undefined) update.category    = category;
    if (price       !== undefined) update.price       = Number(price);
    if (unit        !== undefined) update.unit        = unit;
    if (status      !== undefined) update.status      = status;
    // FIX #6: trim description on update too
    if (description !== undefined) update.description = description.trim();

    const doc = await Service.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, data: toFrontend(doc) });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /services/:id/toggle ────────────────────────────────────────────────
router.patch("/:id/toggle", async (req, res) => {
  try {
    const doc = await Service.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Service not found" });

    doc.status = doc.status === "Active" ? "Inactive" : "Active";
    await doc.save();

    res.json({ success: true, data: toFrontend(doc) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /services/:id ──────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Service.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Service not found" });

    res.json({ success: true, message: "Service deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;