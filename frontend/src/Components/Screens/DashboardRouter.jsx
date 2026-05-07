import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import Dashboard from './Dashboard';
import AdminDashboard from '../Admin/adminDashboard';
import Navbar from '../Main/Top-Header-Section/navbar/navbar';
import Footer from '../Main/Footer/footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';


export default function DashboardRouter() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    console.log('DashboardRouter: Clerk user loaded, ID =', user.id);

    const fetchUserRole = async () => {
      try {
        const url = `${API_BASE_URL}/users/${user.id}`;
        console.log('DashboardRouter: Fetching role from', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('DashboardRouter: Role fetched =', data.user.role);
          setRole(data.user.role);
        } else {
          console.log('DashboardRouter: User not found in DB, defaulting to Customer');
          setRole('Customer');
        }
      } catch (err) {
        console.error('DashboardRouter: Failed to fetch user role:', err);
        setRole('Customer');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (role === 'Admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}
