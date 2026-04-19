const ServiceRequest = require("../Model/ServiceRequestModel");

// GET /sla-analytics — Compute all SLA analytics from service requests
const getSLAAnalytics = async (req, res) => {
  try {
    const allRequests = await ServiceRequest.find().lean();
    const total = allRequests.length;

    if (total === 0) {
      return res.status(200).json({
        overview: { total: 0, completed: 0, completionRate: 0, delayed: 0, delayRate: 0, pending: 0, avgResponseDays: 0, onTimeRate: 0 },
        statusDistribution: [],
        dailyCompletion: [],
        wasteCategories: [],
        locationPerformance: [],
        serviceTypeAnalysis: [],
      });
    }

    // ── Overview KPIs ──────────────────────────────────
    const completed = allRequests.filter((r) => r.status === "Completed").length;
    const delayed = allRequests.filter((r) => r.status === "Delayed").length;
    const pending = allRequests.filter((r) => r.status === "Pending").length;
    const inProgress = allRequests.filter((r) => r.status === "In Progress").length;
    const assigned = allRequests.filter((r) => r.status === "Assigned").length;

    const completionRate = Math.round((completed / total) * 100);
    const delayRate = Math.round((delayed / total) * 100);
    const onTimeRate = total - delayed > 0 ? Math.round(((completed) / (completed + delayed)) * 100) : 0;

    // Average response time (days between createdAt and scheduled_date for completed requests)
    const completedRequests = allRequests.filter((r) => r.status === "Completed" && r.createdAt && r.scheduled_date);
    let avgResponseDays = 0;
    if (completedRequests.length > 0) {
      const totalDays = completedRequests.reduce((sum, r) => {
        const created = new Date(r.createdAt);
        const scheduled = new Date(r.scheduled_date);
        const diff = Math.abs(scheduled - created) / (1000 * 60 * 60 * 24);
        return sum + diff;
      }, 0);
      avgResponseDays = Math.round((totalDays / completedRequests.length) * 10) / 10;
    }

    // ── Status Distribution ────────────────────────────
    const statusDistribution = [
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Assigned", value: assigned, color: "#3b82f6" },
      { name: "In Progress", value: inProgress, color: "#8b5cf6" },
      { name: "Completed", value: completed, color: "#10b981" },
      { name: "Delayed", value: delayed, color: "#ef4444" },
    ].filter((s) => s.value > 0);

    // ── Daily Completion Trend ─────────────────────────
    const dailyMap = {};
    allRequests.forEach((r) => {
      const date = new Date(r.scheduled_date).toISOString().split("T")[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { date, completed: 0, total: 0, delayed: 0 };
      }
      dailyMap[date].total += 1;
      if (r.status === "Completed") dailyMap[date].completed += 1;
      if (r.status === "Delayed") dailyMap[date].delayed += 1;
    });
    const dailyCompletion = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({
        ...d,
        target: 2, // SLA target: 2 completions per day
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));

    // ── Waste Category Breakdown ───────────────────────
    const wasteMap = {};
    allRequests.forEach((r) => {
      wasteMap[r.waste_category] = (wasteMap[r.waste_category] || 0) + 1;
    });
    const wasteCategoryColors = {
      General: "#3b82f6",
      Recyclable: "#10b981",
      Hazardous: "#ef4444",
      Electronic: "#8b5cf6",
      Garden: "#f59e0b",
    };
    const wasteCategories = Object.entries(wasteMap).map(([name, value]) => ({
      name,
      value,
      color: wasteCategoryColors[name] || "#6b7280",
    }));

    // ── Location Performance ──────────────────────────
    const locMap = {};
    allRequests.forEach((r) => {
      if (!locMap[r.location]) {
        locMap[r.location] = { location: r.location, total: 0, completed: 0, delayed: 0, pending: 0 };
      }
      locMap[r.location].total += 1;
      if (r.status === "Completed") locMap[r.location].completed += 1;
      if (r.status === "Delayed") locMap[r.location].delayed += 1;
      if (r.status === "Pending") locMap[r.location].pending += 1;
    });
    const locationPerformance = Object.values(locMap)
      .map((loc) => ({
        ...loc,
        completionRate: loc.total > 0 ? Math.round((loc.completed / loc.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // ── Service Type Analysis ─────────────────────────
    const serviceMap = {};
    allRequests.forEach((r) => {
      if (!serviceMap[r.service_type]) {
        serviceMap[r.service_type] = { name: r.service_type, total: 0, completed: 0, delayed: 0 };
      }
      serviceMap[r.service_type].total += 1;
      if (r.status === "Completed") serviceMap[r.service_type].completed += 1;
      if (r.status === "Delayed") serviceMap[r.service_type].delayed += 1;
    });
    const serviceTypeColors = {
      Household: "#3b82f6",
      Commercial: "#10b981",
      Bulk: "#f59e0b",
      Garden: "#8b5cf6",
      "Drain Cleaning": "#ef4444",
    };
    const serviceTypeAnalysis = Object.values(serviceMap).map((s) => ({
      ...s,
      color: serviceTypeColors[s.name] || "#6b7280",
    }));

    // ── Final Response ────────────────────────────────
    res.status(200).json({
      overview: {
        total,
        completed,
        completionRate,
        delayed,
        delayRate,
        pending,
        inProgress,
        assigned,
        avgResponseDays,
        onTimeRate,
      },
      statusDistribution,
      dailyCompletion,
      wasteCategories,
      locationPerformance,
      serviceTypeAnalysis,
    });
  } catch (err) {
    console.error("SLA Analytics error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getSLAAnalytics };
