import React, { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const rawApiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || window.location.origin;
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');

const resolveRole = (mongoRole, clerkRole) => {
  const normalizedMongoRole = typeof mongoRole === 'string' ? mongoRole.trim().toLowerCase() : '';
  const normalizedClerkRole = typeof clerkRole === 'string' ? clerkRole.trim().toLowerCase() : '';

  if (normalizedClerkRole) return normalizedClerkRole;
  if (normalizedMongoRole) return normalizedMongoRole;
  return 'customer';
};

const buildApiUrl = (path) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export default function RoleRedirect() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      navigate('/', { replace: true });
      return;
    }

    // Fetch the user's role from MongoDB using their Clerk ID, but fall back to Clerk metadata
    const fetchRoleAndRedirect = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        let role = resolveRole('', user.publicMetadata?.role);

        const response = await fetch(buildApiUrl(`/users/${user.id}`), {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          role = resolveRole(data.user?.role, user.publicMetadata?.role);
        } else {
          console.warn('RoleRedirect: User profile lookup failed, using Clerk metadata role');
        }

        console.log('RoleRedirect: User role =', role);

        if (role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin-dashboard', { replace: true });
        } else if (role === 'staff') {
          console.log('Redirecting to staff dashboard');
          navigate('/staff-dashboard', { replace: true });
        } else {
          console.log('Redirecting to user dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('RoleRedirect: Error fetching role:', err);
        const fallbackRole = resolveRole('', user.publicMetadata?.role);
        if (fallbackRole === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (fallbackRole === 'staff') {
          navigate('/staff-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    fetchRoleAndRedirect();
  }, [isLoaded, user, navigate]);

  return <div className="flex items-center justify-center h-screen"><p>Redirecting...</p></div>;
}
