const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot', 'model'], required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema({
  user: {
    clerkId: { type: String, default: null },
    name: { type: String, default: null },
    email: { type: String, default: null },
  },
  messages: { type: [MessageSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
