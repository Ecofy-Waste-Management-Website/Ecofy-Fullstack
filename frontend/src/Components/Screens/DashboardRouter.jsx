import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import Dashboard from './Dashboard';
import Navbar from '../Main/Top-Header-Section/navbar/navbar';
import Footer from '../Main/Footer/footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DashboardRouter() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRole(data.user.role);
        } else {
          setRole('Customer');
        }
      } catch {
        setRole('Customer');
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#06a63e] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar sits fixed on top — sidebar handles its own top offset */}
      <Navbar />
      <Dashboard />
    </div>
  );
}