import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoaded, user } = useUser();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);

        if (response.ok) {
          const data = await response.json();
          const role = data.user.role;

          if (allowedRoles.includes(role)) {
            setAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Role check failed:", error);
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [isLoaded, user, allowedRoles]);

  if (checking) return <p>Checking access...</p>;

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;