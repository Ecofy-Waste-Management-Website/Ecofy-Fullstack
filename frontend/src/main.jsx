import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import App from './App.jsx'

// Components
import Navbar from "./Components/Main/Top-Header-Section/navbar/navbar";
import Footer from "./Components/Main/Footer/footer";
import Hero from "./Components/Main/Hero-Section/Hero";
import Dashboard from "./Components/Screens/Dashboard";
import ServiceHistory from "./Components/Screens/ServiceHistory";
import PaymentHistory from "./Components/Screens/PaymentHistory";
import Notifications from "./Components/Screens/Notifications";
import AdminDashboard from "./Components/Admin/adminDashboard";
import RoleRedirect from "./Components/Auth/RoleRedirect";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/redirect"
      signUpFallbackRedirectUrl="/redirect"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar/><Hero /><Footer/></>} />
          
          {/* Role-based redirect after login */}
          <Route path="/redirect" element={
            <>
              <SignedIn><RoleRedirect /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          
          {/* User Dashboard */}
          <Route path="/dashboard" element={
            <>
              <SignedIn><Navbar/><Dashboard/><Footer/></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          
          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={
            <>
              <SignedIn><AdminDashboard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          {/* Staff Dashboard */}
          <Route path="/staff-dashboard" element={
            <>
              <SignedIn><Navbar/><Dashboard/><Footer/></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          {/* Service History */}
          <Route path="/service-history" element={
            <> 
              <SignedIn><Navbar/><ServiceHistory /><Footer/></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          {/* Payment History */}
          <Route path="/payment-history" element={
            <> 
              <SignedIn><Navbar/><PaymentHistory /><Footer/></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          {/* Notifications */}
          <Route path="/notifications" element={
            <>
              <SignedIn><Navbar/><Notifications /><Footer/></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)