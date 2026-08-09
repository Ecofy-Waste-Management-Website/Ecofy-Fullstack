const express = require("express");
const router = express.Router();

const { getSalesByDate } = require("../Controllers/analyticsControl");

router.get("/sales-by-date", getSalesByDate);

module.exports = router;