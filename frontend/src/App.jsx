import React from "react";
import ContentBlogManagement from "./Components/Admin/contentBlogManagement";

function App() {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">E</div>
          <h1>Ecofy</h1>
        </div>

        <nav className="menu">
          <button className="menu-item">Dashboard</button>
          <button className="menu-item">User Management</button>
          <button className="menu-item submenu">Customers</button>
          <button className="menu-item submenu">Staff</button>
          <button className="menu-item">Service Requests</button>
          <button className="menu-item">Staff Assignment</button>
          <button className="menu-item">SLA Analytics</button>
          <button className="menu-item">Payments</button>
          <button className="menu-item active">Content/Blog</button>
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
              placeholder="Search for requests or staff"
            />
            <div className="bell">!</div>
            <div className="profile">M.N. Mohamed</div>
          </div>
        </header>
        <ContentBlogManagement />

        <footer className="page-footer">&copy; 2026 Ecofy Waste Management</footer>
      </main>
    </div>
  );
}

export default App;