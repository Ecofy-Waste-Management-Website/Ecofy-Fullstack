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
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Navbar from './Components/Top-Header-Section/navbar/navbar';
import ServiceHistory from './Components/Screens/ServiceHistory';
import PaymentHistory from './Components/Screens/PaymentHistory';
import Notifications from './Components/Screens/Notifications';
import Dashboard from './Components/Screens/Dashboard'; 
import Footer from './Components/Footer/footer';
import Hero from './Components/Hero-Section/Hero';
import AdminDashboard from './Components/Admin/adminDashboard';




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
        
        {/* We use our placeholder dashboard here, or user's original Dashboard conditionally */}
        <Route path="/dashboard" element={
          <>
            <SignedIn><Navbar/><Dashboard/><Footer/></SignedIn>
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
            <SignedIn><Navbar/><ServiceHistory /><Footer/></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/payment-history" element={
          <> 
            <SignedIn><Navbar/><PaymentHistory /><Footer/></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />

        <Route path="/notifications" element={
          <>
            <SignedIn><Navbar/><Notifications /><Footer/></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
      </Routes>
    </>
  );
}