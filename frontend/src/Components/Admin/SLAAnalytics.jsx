import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

const RADIAN = Math.PI / 180;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
        const response = await fetch(`${API_BASE_URL}/sla-analytics`);
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
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4" />
        <p className="text-slate-500 font-medium">Loading SLA Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <p className="text-red-500 font-semibold">Error: {error}</p>
      </div>
    );
  }

  const { overview, statusDistribution, dailyCompletion, wasteCategories, locationPerformance, serviceTypeAnalysis } = data;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* ── KPI Cards ────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Requests</p>
          <p className="text-2xl font-bold mt-1 mb-1 text-blue-600">{overview.total}</p>
          <p className="text-xs text-slate-400">All service requests</p>
        </article>
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Completion Rate</p>
          <p className="text-2xl font-bold mt-1 mb-1 text-green-500">{overview.completionRate}%</p>
          <p className="text-xs text-slate-400">{overview.completed} of {overview.total} completed</p>
        </article>
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">On-Time Rate</p>
          <p className="text-2xl font-bold mt-1 mb-1 text-green-500">{overview.onTimeRate}%</p>
          <p className="text-xs text-slate-400">Completed without delays</p>
        </article>
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Avg Response Time</p>
          <p className="text-2xl font-bold mt-1 mb-1 text-purple-600">{overview.avgResponseDays} days</p>
          <p className="text-xs text-slate-400">Request to scheduled date</p>
        </article>
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Delayed Requests</p>
          <p className="text-2xl font-bold mt-1 mb-1 text-red-500">{overview.delayed}</p>
          <p className="text-xs text-slate-400">{overview.delayRate}% delay rate</p>
        </article>
      </section>

      {/* ── Charts Row ───────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Completion Trend (Spans 2 columns on large screens) */}
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-slate-800">Daily Pickup Completion vs Target SLA</h3>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              Last {dailyCompletion.length} days
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyCompletion} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7edf7" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: "#10b981" }} name="Completed" />
              <Line type="monotone" dataKey="target" stroke="#0f5cbd" strokeWidth={2} strokeDasharray="6 3" dot={false} name="SLA Target" />
              <Line type="monotone" dataKey="delayed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: "#ef4444" }} name="Delayed" />
            </LineChart>
          </ResponsiveContainer>
        </article>

        {/* Status Distribution Pie */}
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800">Status Distribution</h3>
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
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
            {statusDistribution.map((s, i) => (
              <span key={i} className="flex items-center text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full mr-2" style={{ background: s.color }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </article>

        {/* Waste Categories Pie */}
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800">Waste Categories</h3>
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
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
            {wasteCategories.map((w, i) => (
              <span key={i} className="flex items-center text-sm text-slate-600">
                <span className="w-3 h-3 rounded-full mr-2" style={{ background: w.color }} />
                {w.name} ({w.value})
              </span>
            ))}
          </div>
        </article>
      </section>

      {/* ── Bottom Row ───────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance Table */}
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-slate-800">Location Performance</h3>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              {locationPerformance.length} areas
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Total</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Completed</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Delayed</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locationPerformance.map((loc, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{loc.location}</td>
                    <td className="px-4 py-3">{loc.total}</td>
                    <td className="px-4 py-3">{loc.completed}</td>
                    <td className={`px-4 py-3 ${loc.delayed > 0 ? "text-red-500 font-bold" : "text-slate-600"}`}>
                      {loc.delayed}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        loc.completionRate >= 80 ? "bg-green-100 text-green-700" :
                        loc.completionRate >= 50 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
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
        <article className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800">Service Type Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceTypeAnalysis} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7edf7" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5d6a82" }} interval={0} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5d6a82" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d7deea", fontSize: 13 }} />
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