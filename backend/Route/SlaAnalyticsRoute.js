const express = require("express");
const router = express.Router();
const { getSLAAnalytics } = require("../Controllers/slaAnalyticsControl");

// GET / — Fetch all SLA analytics data
router.get("/", getSLAAnalytics);

module.exports = router;
