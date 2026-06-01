const PaymentHistory = require("../Model/PaymentHistoryModel");
const Payment = require("../Model/PaymentModel");

const toDayKey = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.toISOString().slice(0, 10);
};

const formatChartDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getSalesByDate = async (req, res) => {
  try {
    const days = Math.max(Number.parseInt(req.query.days, 10) || 5, 1);

    const [paymentHistoryRecords, paymentRecords] = await Promise.all([
      PaymentHistory.find({ status: "Paid" })
        .select("paidAt createdAt amount status")
        .lean(),
      Payment.find({ payment_status: "Completed" })
        .select("payment_date createdAt amount payment_status")
        .lean(),
    ]);

    const payments = [
      ...paymentHistoryRecords.map((payment) => ({
        date: payment.paidAt || payment.createdAt,
      })),
      ...paymentRecords.map((payment) => ({
        date: payment.payment_date || payment.createdAt,
      })),
    ];

    const validDates = payments
      .map((payment) => new Date(payment.date))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (validDates.length === 0) {
      return res.status(200).json({
        data: [],
      });
    }

    const latestDate = new Date(Math.max(...validDates.map((date) => date.getTime())));
    latestDate.setHours(0, 0, 0, 0);

    const countsByDay = new Map();
    payments.forEach((payment) => {
      const rawDate = payment.date;
      const parsedDate = new Date(rawDate);
      if (Number.isNaN(parsedDate.getTime())) return;

      const dayKey = toDayKey(parsedDate);
      countsByDay.set(dayKey, (countsByDay.get(dayKey) || 0) + 1);
    });

    const chartData = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const current = new Date(latestDate);
      current.setDate(current.getDate() - offset);

      const isoDate = toDayKey(current);
      chartData.push({
        date: formatChartDate(isoDate),
        rawDate: isoDate,
        sales: countsByDay.get(isoDate) || 0,
      });
    }

    return res.status(200).json({
      data: chartData,
    });
  } catch (error) {
    console.error("Sales analytics error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSalesByDate };