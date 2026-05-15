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
    <div className="space-y-6">

      {/* ── KPI Cards ────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Requests", val: overview.total, color: "text-[#66c45e]", sub: "All requests" },
          { label: "Completion", val: `${overview.completionRate}%`, color: "text-[#66c45e]", sub: `${overview.completed} done` },
          { label: "On-Time", val: `${overview.onTimeRate}%`, color: "text-[#66c45e]", sub: "No delays" },
          { label: "Avg Response", val: `${overview.avgResponseDays}d`, color: "text-blue-400", sub: "Scheduled time" },
          { label: "Delayed", val: overview.delayed, color: "text-red-400", sub: `${overview.delayRate}% rate` }
        ].map((card, i) => (
          <article key={i} className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-5 rounded-2xl shadow-sm border border-[#397234]/20">
            <p className="text-[10px] font-bold text-[#397239]/60 uppercase tracking-widest">{card.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${card.color.replace('text-green-400', 'text-[#397239]').replace('text-blue-400', 'text-blue-600').replace('text-red-400', 'text-red-600')}`}>{card.val}</p>
            <p className="text-[9px] text-[#397239]/40 uppercase font-bold mt-1">{card.sub}</p>
          </article>
        ))}
      </section>

      {/* ── Charts Row ───────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 rounded-3xl shadow-sm border border-[#397234]/20 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#244c21]">Pickup Completion vs Target</h3>
            <span className="px-3 py-1 bg-[#D6E9CA]/50 text-[#397239] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#397234]/10">SLA Trends</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="completed" stroke="#66c45e" strokeWidth={4} dot={{ r: 4, fill: "#66c45e" }} />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 rounded-3xl shadow-sm border border-[#397234]/20">
          <h3 className="text-lg font-bold text-[#244c21] mb-6">Status Distribution</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} innerRadius={60} outerRadius={85} dataKey="value" labelLine={false} label={renderCustomLabel} stroke="none">
                  {statusDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 rounded-3xl shadow-sm border border-[#397234]/20">
          <h3 className="text-lg font-bold text-[#244c21] mb-6">Waste Categories</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteCategories} innerRadius={60} outerRadius={85} dataKey="value" labelLine={false} label={renderCustomLabel} stroke="none">
                  {wasteCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* ── Bottom Row ───────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 rounded-3xl shadow-sm border border-[#397234]/20">
          <h3 className="text-lg font-bold text-[#244c21] mb-6">Location Performance</h3>
          <div className="overflow-x-auto rounded-2xl bg-[#D6E9CA]/50 border border-[#397234]/10">
            <table className="w-full text-left text-xs text-[#244c21]">
              <thead className="bg-[#112A0F]/5 uppercase tracking-widest text-[9px] font-bold text-[#397239]">
                <tr><th className="p-4">Location</th><th className="p-4">Total</th><th className="p-4">Done</th><th className="p-4">SLA</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {locationPerformance.map((loc, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{loc.location}</td>
                    <td className="p-4">{loc.total}</td>
                    <td className="p-4 text-green-400">{loc.completed}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 font-bold">{loc.completionRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="bg-[#D6E9CA]/50 backdrop-blur-[40px] p-6 rounded-3xl shadow-sm border border-[#397234]/20">
          <h3 className="text-lg font-bold text-[#244c21] mb-6">Service Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceTypeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                <Bar dataKey="total" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#66c45e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  );
}