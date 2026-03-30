import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";

// --- Components ---
import Navbar from './Components/Top-Header-Section/navbar/navbar';
import Footer from '../src/Components/Footer/footer';
import Hero from '../src/Components/Hero-Section/Hero';

// --- Screens ---
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import Dashboard from './Components/Screens/Dashboard';

// --- Auth & Admin ---
import RoleRedirect from './Components/Auth/RoleRedirect';
import AdminDashboard from './Components/Admin/adminDashboard';
import StaffDashboard from './Components/Staff/staffDashboard';

export default function App() {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. AUTO-REDIRECT LOGIC: If a user refreshes the home page but is already logged in,
  // we immediately send them to the role-redirect to find their dashboard.
  useEffect(() => {
    if (isLoaded && isSignedIn && location.pathname === "/") {
      navigate("/role-redirect");
    }
  }, [isLoaded, isSignedIn, location.pathname, navigate]);

  // 2. LOADING STATE: Prevents the Hero section from appearing for a split second
  // while Clerk is still checking if you are logged in.
  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Define which paths should NOT show the main Navbar and Footer
  const hideOnRoutes = ["/admin-dashboard", "/staff-dashboard", "/role-redirect"];
  
  // Check if the current path starts with any of the hidden routes
  const isDashboard = hideOnRoutes.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Only show Navbar if we are NOT on a dashboard/redirect page */}
      {!isDashboard && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/role-redirect" element={<RoleRedirect />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>

      {/* Only show Footer if we are NOT on a dashboard/redirect page */}
      {!isDashboard && <Footer />}
    </>
  );
}