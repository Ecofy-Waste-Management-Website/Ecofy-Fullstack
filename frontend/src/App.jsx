import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Main/Top-Header-Section/navbar/navbar'

import ServiceHistory from './Components/Screens/ServiceHistory'
import PaymentHistory from './Components/Screens/PaymentHistory'
import Notifications from './Components/Screens/Notifications'
import Footer from './Components/Main/Footer/footer'
import Hero from './Components/Main/Hero-Section/Hero'
import Dashboard from './Components/Screens/Dashboard'
import Footer from './Components/Footer/footer'
import Hero from './Components/Hero-Section/Hero'
import AdminDashboard from './Components/Admin/adminDashboard'




export default function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/hello")
  //     .then(res => res.json())
  //     .then(data => setMessage(data.message))
  //     .catch(err => console.error(err));
  // }, []);

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