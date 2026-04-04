import React, { useState } from "react";
import './adminDashboard.css';
import { createStaffAccount } from "../../services/api/adminService";

const stats = [
  { label: "Total Revenue", value: "LKR 2,345,000", icon: "$" },
  { label: "Pending Requests", value: "41", icon: "PR" },
  { label: "Active Staff", value: "18", icon: "AS" },
  { label: "Avg. Response Time", value: "15 min", icon: "RT" },
];

const taskRows = [
  {
    requestId: "#REQ102",
    customer: "Bandara Y.",
    location: "Kandy",
    status: "Pending",
    assignedStaff: "Select Staff",
  },
  {
    requestId: "#REQ101",
    customer: "Pathirana P.",
    location: "Colombo",
    status: "In-Progress",
    assignedStaff: "Banuka J.",
  },
  {
    requestId: "#REQ100",
    customer: "Mohamed A.",
    location: "Colombo",
    status: "Completed",
    assignedStaff: "Priyantha S.",
  },
];

const escalations = [
  {
    title: "Admin Escalation",
    customer: "Customer: Bandara Y.",
    summary: "Summary pending pickup confirmation.",
    time: "3 sec ago",
  },
  {
    title: "Admin Escalation",
    customer: "Customer: Pathirana P.",
    summary: "Summary late route update and follow-up.",
    time: "3 sec ago",
  },
  {
    title: "Admin Escalation",
    customer: "Customer: Priyantha S.",
    summary: "Summary delayed escalation closure.",
    time: "1m ago",
  },
];

export default function AdminDashboard() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    try {
      // In a real application, obtain the actual JWT from your Auth Context / Storage
      const token = localStorage.getItem('token') || 'your-admin-jwt-token';
      const response = await createStaffAccount(formData, token);
      setStatus({ type: "success", message: response.message || "Staff created successfully!" });
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Failed to create staff account" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">E</div>
          <h1>Ecofy</h1>
        </div>
        <nav className="menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">User Management</button>
          <button className="menu-item submenu">Customers</button>
          <button className="menu-item submenu">Staff</button>
          <button className="menu-item">Service Requests</button>
          <button className="menu-item">Staff Assignment</button>
          <button className="menu-item">SLA Analytics</button>
          <button className="menu-item">Payments</button>
          <button className="menu-item">Content/Blog</button>
          <button className="menu-item">Settings</button>
        </nav>
        <div className="admin-card">
          <div className="avatar">MN</div>
          <div>
            <p className="admin-role">Admin:</p>
            <p className="admin-name">M.N. Mohamed</p>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h2>Ecofy Admin Dashboard</h2>
          <div className="topbar-right">
            <input
              type="text"
              className="search"
              placeholder="Search for requests or users"
            />
            <div className="bell">7</div>
            <div className="profile">M.N. Mohamed</div>
          </div>
        </header>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div>
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel analytics-panel">
            <div className="panel-head">
              <h3>SLA &amp; Analytics</h3>
              <button>...</button>
            </div>
            <h4>Daily Pickup Completion vs Target SLA</h4>
            <div className="line-chart">
              <div className="line one" />
              <div className="line two" />
              <div className="x-axis">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <h4>Waste Categories</h4>
            <div className="donut-wrap">
              <div className="donut" />
              <div className="legend">
                <p><span className="dot household" /> Household</p>
                <p><span className="dot industrial" /> Industrial</p>
              </div>
            </div>
          </article>

          <article className="panel tasks-panel">
            <div className="panel-head">
              <h3>Task Management</h3>
              <button>...</button>
            </div>
            <h4>Active Service Requests</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Assigned Staff</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taskRows.map((row) => (
                    <tr key={row.requestId}>
                      <td>{row.requestId}</td>
                      <td>{row.customer}</td>
                      <td>{row.location}</td>
                      <td>
                        <span className={`status ${row.status.toLowerCase().replace("-", "")}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button className="assign-btn">{row.assignedStaff}</button>
                      </td>
                      <td>
                        <button className="view-btn">View/Assign</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bottom-space" />
          </article>

          <article className="panel escalations-panel">
            <div className="panel-head">
              <h3>Chatbot Escalations</h3>
              <button>...</button>
            </div>
            {escalations.map((item) => (
              <div key={item.customer} className="escalation-item">
                <div className="escalation-title-row">
                  <p className="escalation-title">{item.title}</p>
                  <span>{item.time}</span>
                </div>
                <p>{item.customer}</p>
                <p>{item.summary}</p>
              </div>
            ))}
          </article>

          {/* New Tailwind CSS styled Staff Creation Panel */}
          <article className="panel staff-panel flex flex-col gap-4 max-w-md bg-white p-6 rounded-lg shadow-md mt-4 col-span-full border border-gray-200">
            <div className="panel-head mb-2 border-b pb-2">
              <h3 className="text-xl font-bold text-gray-800">Create Staff Account</h3>
            </div>
            
            {status.message && (
              <div className={`p-3 rounded-md text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className="w-1/2 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-1/2 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Temporary Password" className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-blue-400">
                {isLoading ? 'Processing...' : 'Create Staff Member'}
              </button>
            </form>
          </article>
        </section>
        <footer className="page-footer">&copy; 2026 Ecofy Waste Management</footer>
      </main>
    </div>
  );
}