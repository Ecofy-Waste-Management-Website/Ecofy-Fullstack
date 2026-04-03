import React from "react";
import './adminDashboard.css';

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
        </section>
        <footer className="page-footer">&copy; 2026 Ecofy Waste Management</footer>
      </main>
    </div>
  );
}