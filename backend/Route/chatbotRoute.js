const express = require("express");
const router = express.Router();
const { chatMessage, getSessions, getSessionById } = require("../Controllers/chatbotController");

// POST /  —  Send a message to the AI chatbot
router.post("/", chatMessage);

// GET /sessions — list sessions for admin
router.get("/sessions", getSessions);

// GET /sessions/:id — get single session
router.get("/sessions/:id", getSessionById);

module.exports = router;
