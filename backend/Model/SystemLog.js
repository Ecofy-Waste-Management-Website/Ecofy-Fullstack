const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    statusCode: { type: Number, required: true },
    actorId: { type: String, default: '' },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

systemLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
