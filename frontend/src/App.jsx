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



import React from "react";
import Navbar from '../src/Components/Top-Header-Section/navbar/navbar'
import Logo from '../src/Components/Top-Header-Section/Logo/logo'
import Signup from '../src/Components/Top-Header-Section/Signup/signup'
import Hero from '../src/Components/Hero-Section/Hero'
import Footer from '../src/Components/Footer/footer'

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
  <div>
    <Signup/>
    <Navbar/>
    <Logo/>
    <Footer/>
  </div>
  )
}