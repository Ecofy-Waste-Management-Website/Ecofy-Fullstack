import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedStaffRoute({ children }) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkRole = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const role = data.user.role;

          if (role === 'Staff' || role === 'Admin') {
            setAuthorized(true);
          } else {
            // Customer trying to access staff page
            navigate('/dashboard', { replace: true });
          }
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Role check failed:', err);
        navigate('/dashboard', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [isLoaded, user, navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Verifying access...</p>
      </div>
    );
  }

  return authorized ? children : null;
}