import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function RoleRedirect() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Fetch the user's role from MongoDB using their Clerk ID
    const fetchRoleAndRedirect = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(`http://localhost:5001/users/${user.id}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          const role = data.user.role;
          console.log('RoleRedirect: User role =', role);

          if (role === 'Admin') {
            console.log('Redirecting to admin dashboard');
            navigate('/admin-dashboard', { replace: true });
          } else if (role === 'Staff') {
            console.log('Redirecting to staff dashboard');
            navigate('/staff-dashboard', { replace: true });
          } else {
            console.log('Redirecting to user dashboard');
            navigate('/dashboard', { replace: true });
          }
        } else {
          console.log('RoleRedirect: User not found in DB, defaulting to customer dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('RoleRedirect: Error fetching role:', err);
        navigate('/dashboard', { replace: true });
      }
    };

    fetchRoleAndRedirect();
  }, [isLoaded, user, navigate]);

  return <div className="flex items-center justify-center h-screen"><p>Redirecting...</p></div>;
}
