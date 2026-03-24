const ServiceHistory = require("../Model/ServiceHistoryModel");

// GET /service-history/:clerkId
const getServiceHistory = async (req, res) => {
  try {
    const { email } = req.params;
    const records = await ServiceHistory.find({ email })
      .sort({ scheduledDate: -1 })
      .select("-__v");

    res.status(200).json({
      message: "Service history fetched successfully",
      count: records.length,
      serviceHistory: records,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /service-history (create a record — useful for testing / admin use)
const createServiceHistory = async (req, res) => {
  try {
    const record = new ServiceHistory(req.body);
    await record.save();
    res.status(201).json({ message: "Service history record created", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getServiceHistory, createServiceHistory };