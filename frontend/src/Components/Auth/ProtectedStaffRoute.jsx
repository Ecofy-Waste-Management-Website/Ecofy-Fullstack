import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { buildApiUrl } from '../../utils/apiBaseUrl';
import { resolveRole } from '../../utils/roles';

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
        let role = resolveRole('', user.publicMetadata?.role);
        const response = await fetch(buildApiUrl(`/users/${user.id}`));

        if (response.ok) {
          const data = await response.json();
          role = resolveRole(data.user?.role, user.publicMetadata?.role);
        } else {
          console.warn('ProtectedStaffRoute: User profile lookup failed, using Clerk metadata role');
        }

        if (role === 'staff' || role === 'admin') {
          setAuthorized(true);
        } else {
          setRedirectTo('/dashboard');
        }
      } catch (err) {
        console.error('Role check failed:', err);
        const fallbackRole = resolveRole('', user.publicMetadata?.role);
        if (fallbackRole === 'staff' || fallbackRole === 'admin') {
          setAuthorized(true);
        } else {
          setRedirectTo('/dashboard');
        }
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