import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Components/Top-Header-Section/navbar/navbar';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import DashboardPlaceholder from './Components/Dashboard/Dashboard'; // The one we created
import Dashboard from './Components/Screens/Dashboard'; // User's original dashboard
import Footer from './Components/Footer/footer';
import Hero from './Components/Hero-Section/Hero';
import AdminDashboard from './Components/Admin/adminDashboard';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Navbar/><Hero /><Footer/></>} />
        
        {/* We use our placeholder dashboard here, or user's original Dashboard conditionally */}
        <Route path="/dashboard" element={
          <>
            <SignedIn>
              <Navbar/>
              <DashboardPlaceholder />
              <Footer/>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/service-history" element={<><Navbar/><ServiceHistory /><Footer/></>} />
        <Route path="/payment-history" element={<><Navbar/><PaymentHistory /><Footer/></>} />
        <Route path="/notifications" element={<><Navbar/><Notifications /><Footer/></>} />
      </Routes>
    </>
  );
}