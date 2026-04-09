import React from 'react';
import RoleRedirect from "./Components/Auth/RoleRedirect";
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import Footer from './Components/Main/Footer/footer';
import Hero from './Components/Main/Hero-Section/Hero';
import AdminDashboard from './Components/Admin/adminDashboard';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Dashboard from './Components/Screens/Dashboard'; 

export default function App() {
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

        {/* The Login Redirect */}
        <Route path="/redirect" element={
          <>
            <SignedIn><RoleRedirect /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </> 
        } />

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
  );
}