import React from "react";
import { Routes, Route } from 'react-router-dom';
import {SignedIn, SignedOut, RedirectToSignIn} from '@clerk/clerk-react';
import Navbar from './Components/Top-Header-Section/navbar/navbar'
import ServiceHistory from './Components/Screens/ServiceHistory'
import PaymentHistory from './Components/Screens/PaymentHistory'
import Notifications from './Components/Screens/Notifications'
import Dashboard from './Components/Screens/Dashboard'
import Footer from './Components/Footer/footer'
import Hero from './Components/Hero-Section/Hero'
import AdminDashboard from './Components/Admin/adminDashboard'


function ProtectedRoute({children}) {
  return (
    <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn/></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Navbar/><Hero /><Footer/></>} />


        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Navbar /><Dashboard /><Footer />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        
        <Route path="/service-history" element={
          <ProtectedRoute>
            <Navbar /><ServiceHistory /><Footer />
          </ProtectedRoute>
        } />

        <Route path="/payment-history" element={
          <ProtectedRoute>
            <Navbar /><PaymentHistory /><Footer />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <Navbar /><Notifications /><Footer />
          </ProtectedRoute>
        } />
        
      </Routes>
    </>
  )
}