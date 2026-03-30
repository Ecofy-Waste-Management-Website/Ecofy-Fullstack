import React from 'react'
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function RoleRedirect() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  // If no user is logged in, perhaps they shouldn't be here, but just in case:
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Retrieve primary email safely
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();

  // Define role-based emails
  const adminEmails = ['banukadeseram12@gmail.com'];
  const staffEmails = ['staff@example.com']; // Placeholder for staff email

  if (adminEmails.includes(email)) {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (staffEmails.includes(email)) {
    return <Navigate to="/staff-dashboard" replace />;
  } else {
    // Default fallback is the user dashboard
    return <Navigate to="/dashboard" replace />;
  }
}
