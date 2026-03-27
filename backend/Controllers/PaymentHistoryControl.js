const PaymentHistory = require("../Model/PaymentHistoryModel");

// GET /payment-history/:clerkId
const getPaymentHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const records = await PaymentHistory.find({ clerkId })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      message: "Payment history fetched successfully",
      count: records.length,
      paymentHistory: records,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /payment-history (create a record — useful for testing / admin use)
const createPaymentHistory = async (req, res) => {
  try {
    const record = new PaymentHistory(req.body);
    await record.save();
    res.status(201).json({ message: "Payment record created", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getPaymentHistory, createPaymentHistory };