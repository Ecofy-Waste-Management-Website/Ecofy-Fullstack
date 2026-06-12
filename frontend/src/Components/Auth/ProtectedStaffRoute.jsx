import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProtectedStaffRoute({ children }) {
  const { user, isLoaded } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setRedirectTo('/');
      setChecking(false);
      return;
    }

    const checkRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const role = data.user.role;

          if (role === 'Staff' || role === 'Admin') {
            setAuthorized(true);
          } else {
            setRedirectTo('/dashboard');
          }
        } else {
          setRedirectTo('/dashboard');
        }
      } catch (err) {
        console.error('Role check failed:', err);
        setRedirectTo('/dashboard');
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [isLoaded, user]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Verifying staff access...</p>
      </div>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return authorized ? children : <Navigate to="/" replace />;
}