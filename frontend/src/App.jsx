import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import Dashboard from './Components/Screens/Dashboard';
import Footer from './Components/Main/Footer/footer';
import Hero from './Components/Main/Hero-Section/Hero';
import AdminDashboard from './Components/Admin/adminDashboard';


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Navbar /><Hero /><Footer /></>} />

        <Route path="/dashboard" element={
          <>
            <SignedIn><Navbar /><Dashboard /><Footer /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/admin" element={
          <>
            <SignedIn><AdminDashboard /></SignedIn>
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