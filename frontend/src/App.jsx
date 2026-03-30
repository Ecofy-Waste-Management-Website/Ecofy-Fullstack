import React from "react";
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Top-Header-Section/navbar/navbar'
import ServiceHistory from './Components/Screens/ServiceHistory'
import PaymentHistory from './Components/Screens/PaymentHistory'
import Notifications from './Components/Screens/Notifications'
import Dashboard from './Components/Screens/Dashboard'
import Footer from './Components/Footer/footer'
import Hero from './Components/Hero-Section/Hero'
import AdminDashboard from './Components/Admin/adminDashboard'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><Navbar/><Hero /><Footer/></>} />
        <Route path="/dashboard" element={<><Navbar/><Dashboard /><Footer/></>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/service-history" element={<><Navbar/><ServiceHistory /><Footer/></>} />
        <Route path="/payment-history" element={<><Navbar/><PaymentHistory /><Footer/></>} />
        <Route path="/notifications" element={<><Navbar/><Notifications /><Footer/></>} />
      </Routes>
    </>
  )
}