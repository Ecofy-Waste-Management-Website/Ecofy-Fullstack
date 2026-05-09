const express = require("express");
const router = express.Router();
const { chatMessage } = require("../Controllers/chatbotController");

// POST /  —  Send a message to the AI chatbot
router.post("/", chatMessage);

module.exports = router;
