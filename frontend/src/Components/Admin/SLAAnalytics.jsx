import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";
import "./SLAAnalytics.css";

const RADIAN = Math.PI / 180;

// Custom pie label renderer
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SLAAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/sla-analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("SLA Analytics fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="sla-loading">
        <div className="sla-spinner" />
        <p style={{ color: "#5f6c85" }}>Loading SLA Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sla-loading">
        <p style={{ color: "#ef4444", fontWeight: 600 }}>Error: {error}</p>
      </div>
    );
  }

  const { overview, statusDistribution, dailyCompletion, wasteCategories, locationPerformance, serviceTypeAnalysis } = data;

  return (
    <div className="sla-analytics">

      {/* ── KPI Cards ────────────────────────────────── */}
      <section className="sla-kpi-grid">
        <article className="sla-kpi-card">
          <p className="sla-kpi-label">Total Requests</p>
          <p className="sla-kpi-value blue">{overview.total}</p>
          <p className="sla-kpi-sub">All service requests</p>
        </article>
        <article className="sla-kpi-card">
          <p className="sla-kpi-label">Completion Rate</p>
          <p className="sla-kpi-value green">{overview.completionRate}%</p>
          <p className="sla-kpi-sub">{overview.completed} of {overview.total} completed</p>
        </article>
        <article className="sla-kpi-card">
          <p className="sla-kpi-label">On-Time Rate</p>
          <p className="sla-kpi-value green">{overview.onTimeRate}%</p>
          <p className="sla-kpi-sub">Completed without delays</p>
        </article>
        <article className="sla-kpi-card">
          <p className="sla-kpi-label">Avg Response Time</p>
          <p className="sla-kpi-value purple">{overview.avgResponseDays} days</p>
          <p className="sla-kpi-sub">Request to scheduled date</p>
        </article>
        <article className="sla-kpi-card">
          <p className="sla-kpi-label">Delayed Requests</p>
          <p className="sla-kpi-value red">{overview.delayed}</p>
          <p className="sla-kpi-sub">{overview.delayRate}% delay rate</p>
        </article>
      </section>

      {/* ── Charts Row ───────────────────────────────── */}
      <section className="sla-charts-row">
        {/* Daily Completion Trend */}
        <article className="sla-panel">
          <div className="sla-panel-header">
            <h3>Daily Pickup Completion vs Target SLA</h3>
            <span className="sla-badge">Last {dailyCompletion.length} days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyCompletion} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7edf7" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: "#10b981" }} name="Completed" />
              <Line type="monotone" dataKey="target" stroke="#0f5cbd" strokeWidth={2} strokeDasharray="6 3" dot={false} name="SLA Target" />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} name="Delayed" />
            </LineChart>
          </ResponsiveContainer>
        </article>

        {/* Status Distribution Pie */}
        <article className="sla-panel">
          <div className="sla-panel-header">
            <h3>Status Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={90}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {statusDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="sla-legend">
            {statusDistribution.map((s, i) => (
              <span key={i} className="sla-legend-item">
                <span className="sla-legend-dot" style={{ background: s.color }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </article>

        {/* Waste Categories Pie */}
        <article className="sla-panel">
          <div className="sla-panel-header">
            <h3>Waste Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={wasteCategories}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={90}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {wasteCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="sla-legend">
            {wasteCategories.map((w, i) => (
              <span key={i} className="sla-legend-item">
                <span className="sla-legend-dot" style={{ background: w.color }} />
                {w.name} ({w.value})
              </span>
            ))}
          </div>
        </article>
      </section>

      {/* ── Bottom Row ───────────────────────────────── */}
      <section className="sla-bottom-row">
        {/* Location Performance Table */}
        <article className="sla-panel">
          <div className="sla-panel-header">
            <h3>Location Performance</h3>
            <span className="sla-badge">{locationPerformance.length} areas</span>
          </div>
          <div className="sla-table-wrap">
            <table className="sla-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Total</th>
                  <th>Completed</th>
                  <th>Delayed</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {locationPerformance.map((loc, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{loc.location}</td>
                    <td>{loc.total}</td>
                    <td>{loc.completed}</td>
                    <td style={{ color: loc.delayed > 0 ? "#ef4444" : "inherit", fontWeight: loc.delayed > 0 ? 700 : 400 }}>
                      {loc.delayed}
                    </td>
                    <td>
                      <span className={`rate-badge ${loc.completionRate >= 80 ? "high" : loc.completionRate >= 50 ? "medium" : "low"}`}>
                        {loc.completionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Service Type Analysis Bar Chart */}
        <article className="sla-panel">
          <div className="sla-panel-header">
            <h3>Service Type Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceTypeAnalysis} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7edf7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5d6a82" }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delayed" fill="#ef4444" name="Delayed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>
    </div>
  );
}
