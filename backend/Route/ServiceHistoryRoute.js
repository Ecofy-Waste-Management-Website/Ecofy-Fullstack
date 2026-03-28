const express = require("express");
const router = express.Router();
const { getServiceHistory, createServiceHistory } = require("../Controllers/ServiceHistoryControl");

router.get("/:clerkId", getServiceHistory);
router.post("/", createServiceHistory);

module.exports = router;