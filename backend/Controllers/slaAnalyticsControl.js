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

    // ⚡ Bolt Optimization: Single-pass aggregation O(N) instead of 11 separate array iterations/filters.
    // Reduces array iteration overhead by ~90% and eliminates redundant array allocations in V8 memory.
    let completed = 0;
    let delayed = 0;
    let pending = 0;
    let inProgress = 0;
    let assigned = 0;

    let completedWithDatesCount = 0;
    let totalResponseDays = 0;

    const dailyMap = {};
    const wasteMap = {};
    const locMap = {};
    const serviceMap = {};

    for (let i = 0; i < total; i += 1) {
      const r = allRequests[i];
      const { status, waste_category, location, service_type, scheduled_date, createdAt } = r;

      // Status aggregation & KPI metrics
      if (status === "Completed") {
        completed += 1;
        if (createdAt && scheduled_date) {
          const createdTime = new Date(createdAt).getTime();
          const scheduledTime = new Date(scheduled_date).getTime();
          if (!Number.isNaN(createdTime) && !Number.isNaN(scheduledTime)) {
            totalResponseDays += Math.abs(scheduledTime - createdTime) / 86400000;
            completedWithDatesCount += 1;
          }
        }
      } else if (status === "Delayed") {
        delayed += 1;
      } else if (status === "Pending") {
        pending += 1;
      } else if (status === "In Progress") {
        inProgress += 1;
      } else if (status === "Assigned") {
        assigned += 1;
      }

      // Daily Completion Trend
      if (scheduled_date) {
        const schedDate = new Date(scheduled_date);
        if (!Number.isNaN(schedDate.getTime())) {
          const dateStr = schedDate.toISOString().slice(0, 10);
          if (!dailyMap[dateStr]) {
            dailyMap[dateStr] = { date: dateStr, completed: 0, total: 0, delayed: 0 };
          }
          dailyMap[dateStr].total += 1;
          if (status === "Completed") dailyMap[dateStr].completed += 1;
          if (status === "Delayed") dailyMap[dateStr].delayed += 1;
        }
      }

      // Waste Category Breakdown
      if (waste_category) {
        wasteMap[waste_category] = (wasteMap[waste_category] || 0) + 1;
      }

      // Location Performance
      if (location) {
        if (!locMap[location]) {
          locMap[location] = { location, total: 0, completed: 0, delayed: 0, pending: 0 };
        }
        locMap[location].total += 1;
        if (status === "Completed") locMap[location].completed += 1;
        if (status === "Delayed") locMap[location].delayed += 1;
        if (status === "Pending") locMap[location].pending += 1;
      }

      // Service Type Analysis
      if (service_type) {
        if (!serviceMap[service_type]) {
          serviceMap[service_type] = { name: service_type, total: 0, completed: 0, delayed: 0 };
        }
        serviceMap[service_type].total += 1;
        if (status === "Completed") serviceMap[service_type].completed += 1;
        if (status === "Delayed") serviceMap[service_type].delayed += 1;
      }
    }

    const completionRate = Math.round((completed / total) * 100);
    const delayRate = Math.round((delayed / total) * 100);
    const onTimeRate = total - delayed > 0 ? Math.round((completed / (completed + delayed)) * 100) : 0;
    const avgResponseDays = completedWithDatesCount > 0
      ? Math.round((totalResponseDays / completedWithDatesCount) * 10) / 10
      : 0;

    // ── Status Distribution ────────────────────────────
    const statusDistribution = [
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Assigned", value: assigned, color: "#3b82f6" },
      { name: "In Progress", value: inProgress, color: "#8b5cf6" },
      { name: "Completed", value: completed, color: "#10b981" },
      { name: "Delayed", value: delayed, color: "#ef4444" },
    ].filter((s) => s.value > 0);

    // ── Daily Completion Trend ─────────────────────────
    const dailyCompletion = Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => {
        const [year, month, day] = d.date.split("-").map(Number);
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          ...d,
          target: 2, // SLA target: 2 completions per day
          date: formattedDate,
        };
      });

    // ── Waste Category Breakdown ───────────────────────
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
    const locationPerformance = Object.values(locMap)
      .map((loc) => ({
        ...loc,
        completionRate: loc.total > 0 ? Math.round((loc.completed / loc.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // ── Service Type Analysis ─────────────────────────
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
