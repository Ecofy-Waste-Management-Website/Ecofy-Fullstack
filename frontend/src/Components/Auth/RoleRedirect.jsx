import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function RoleRedirect() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return; // Wait for user data to load

    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Retrieve primary email safely
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    console.log('User email:', email); // Debug log

    // Define role-based emails
    const adminEmails = ['banukadeseram12@gmail.com'];
    const staffEmails = ['staff@example.com']; // Placeholder for staff email

    if (adminEmails.includes(email)) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin-dashboard', { replace: true });
    } else if (staffEmails.includes(email)) {
      console.log('Redirecting to staff dashboard');
      navigate('/staff-dashboard', { replace: true });
    } else {
      console.log('Redirecting to user dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isLoaded, user, navigate]);

  // Show loading while user data is being fetched
  return <div className="flex items-center justify-center h-screen"><p>Redirecting...</p></div>;
}
