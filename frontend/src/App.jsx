import React, { useEffect, useState } from "react";

import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Top-Header-Section/navbar/navbar'
import ServiceHistory from './Components/Screens/ServiceHistory'
import PaymentHistory from './Components/Screens/PaymentHistory'
import Notifications from './Components/Screens/Notifications'
import Footer from '../src/Components/Footer/footer'
import Hero from '../src/Components/Hero-Section/Hero'
import RoleRedirect from './Components/Auth/RoleRedirect'
import AdminDashboard from './Components/Admin/adminDashboard'
import StaffDashboard from './Components/Staff/staffDashboard'
import Dashboard from './Components/Screens/Dashboard'




export default function App() {

  return (

    <>
      <Navbar/>
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
      <Footer/>
    </>


  )
}