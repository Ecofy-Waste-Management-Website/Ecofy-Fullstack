<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
import ContentBlogManagement from "./Components/Admin/contentBlogManagement";

function App() {
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Components
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar';
import Footer from './Components/Main/Footer/footer';
import Hero from './Components/Main/Hero-Section/Hero';
import Dashboard from './Components/Screens/Dashboard'; 
import AdminDashboard from './Components/Admin/adminDashboard';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';

// Auth Components
import RoleRedirect from "./Components/Auth/RoleRedirect";
import ProtectedRoute from './Components/Auth/ProtectedRoute';

export default function App() {
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
  return (
    <>
      <Routes>
        
        {/* The Landing Page (Public) */}
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <Footer />
          </>
        } />

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
        {/* The Login Redirect */}
        <Route path="/redirect" element={
          <>
            <SignedIn><RoleRedirect /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </> 
        } />
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb

        {/* Regular Customer Dashboard (Anyone logged in can see this) */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <Navbar />
              <Dashboard />
              <Footer />
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
        {/* Admin Dashboard (ONLY Admins can see this) */}
        <Route path="/admin-dashboard" element={
          <>
            <SignedIn>
              {/* ProtectedRoute goes INSIDE SignedIn */}
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            </SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/service-history" element={
          <>
            <SignedIn><Navbar /><ServiceHistory /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/payment-history" element={
          <>
            <SignedIn><Navbar /><PaymentHistory /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/notifications" element={
          <>
            <SignedIn><Navbar /><Notifications /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
      </Routes>
    </>
<<<<<<< HEAD
>>>>>>> 7a60d0c94eda94e8e5d0035113597bce21fd5f2a
=======
>>>>>>> e7398e1c8aea3735a4fb42fee6393ee1ca0625bb
  );
}