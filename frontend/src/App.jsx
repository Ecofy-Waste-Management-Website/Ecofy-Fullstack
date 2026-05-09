import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Components
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar';
import Footer from './Components/Main/Footer/footer';
import Hero from './Components/Main/Hero-Section/Hero';
import Blogs from './Components/Main/Blogs/blogs';
import DashboardRouter from './Components/Screens/DashboardRouter'; 
import AdminDashboard from './Components/Admin/adminDashboard';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import StaffDashboard from './Components/Staff/staffDashboard';
import ContactUs from './Components/Main/Contact/Contact';
import ProfileSettings from "./Components/Screens/ProfileSettings";
import About from './Components/Main/About/About';


// Auth Components
import RoleRedirect from "./Components/Auth/RoleRedirect";
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import ProtectedStaffRoute from './Components/Auth/ProtectedStaffRoute';

// Chatbot
import ChatbotWidget from './Components/Chatbot/ChatbotWidget';


const PrivateRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default function App() {
  const [chatbotBookingOpen, setChatbotBookingOpen] = useState(false);

  return (
    <>
    <Routes>

      {/* Home */}
      <Route path="/" element={
        <>
          <SignedIn>
            <RoleRedirect />
          </SignedIn>

          <SignedOut>
            <Navbar />
            <Hero />
            <Footer />
          </SignedOut>
        </>
      } />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Redirect after login */}
      <Route path="/redirect" element={
        <PrivateRoute>
          <RoleRedirect />
        </PrivateRoute>
      } />

      {/* Blogs */}
      <Route path="/blogs" element={
        <>
          <Navbar />
          <Blogs />
          <Footer />
        </>
      } />

      {/* User Dashboard */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardRouter />
        </PrivateRoute>
      } />

      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={
        <PrivateRoute>
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </PrivateRoute>
      } />

      <Route path="/admin" element={
        <PrivateRoute>
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </PrivateRoute>
      } />

      {/* Staff Dashboard */}
      <Route path="/staff-dashboard" element={
        <PrivateRoute>
          <ProtectedStaffRoute>
            <StaffDashboard />
          </ProtectedStaffRoute>
        </PrivateRoute>
      } />

      {/* Service History */}
      <Route path="/service-history" element={
        <PrivateRoute>
          <Navbar />
          <ServiceHistory />
          <Footer />
        </PrivateRoute>
      } />

      {/* Payment History */}
      <Route path="/payment-history" element={
        <PrivateRoute>
          <Navbar />
          <PaymentHistory />
          <Footer />
        </PrivateRoute>
      } />

      {/* Notifications */}
      <Route path="/notifications" element={
        <PrivateRoute>
          <Navbar />
          <Notifications />
          <Footer />
        </PrivateRoute>
      } />

      {/* Profile Settings */}
      <Route path="/profile-settings" element={<ProfileSettings />} />

      {/* Contact */}
      <Route path="/contact" element={<><Navbar /><ContactUs /><Footer /></>} />

      {/* About */}
      <Route path="/about" element={ <><Navbar /> <About /> <Footer /></>} />

    </Routes>

    {/* Global AI Chatbot Widget */}
    <ChatbotWidget onOpenBooking={() => setChatbotBookingOpen(true)} />
    </>
  );
}