import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const resolveRole = (mongoRole, clerkRole) => {
  const normalizedMongoRole = typeof mongoRole === "string" ? mongoRole.trim().toLowerCase() : "";
  const normalizedClerkRole = typeof clerkRole === "string" ? clerkRole.trim().toLowerCase() : "";

  if (normalizedClerkRole) return normalizedClerkRole;
  if (normalizedMongoRole) return normalizedMongoRole;
  return "customer";
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoaded, user } = useUser();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkRole = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
        const allowed = allowedRoles.map((role) => role.toLowerCase());

        if (response.ok) {
          const data = await response.json();
          const role = resolveRole(data.user.role, user.publicMetadata?.role);

          if (allowed.includes(role)) {
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