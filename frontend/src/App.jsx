import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Top-Header-Section/navbar/navbar'
import Logo from './Components/Top-Header-Section/Logo/logo'
import Signup from './Components/Top-Header-Section/Signup/signup'
import Footer from './Components/Footer/footer'
import ServiceHistory from './Components/Screens/ServiceHistory'
import PaymentHistory from './Components/Screens/PaymentHistory'
import Notifications from './Components/Screens/Notifications'


import Navbar from '../src/Components/Top-Header-Section/navbar/navbar'
import Footer from '../src/Components/Footer/footer'
import Hero from '../src/Components/Hero-Section/Hero'




export default function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("http://localhost:5000/api/hello")
  //     .then(res => res.json())
  //     .then(data => setMessage(data.message))
  //     .catch(err => console.error(err));
  // }, []);

  return (

    <BrowserRouter>
  
      <Signup/>
      <Navbar/>
      <Logo/>
      <Routes>
        <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/notifications" element={<Notifications />} />
      </Routes>
      <Footer/>
    </BrowserRouter>

  <div>
    <Navbar/>
    <Hero/>
    <Footer/>
  </div>

  )
}