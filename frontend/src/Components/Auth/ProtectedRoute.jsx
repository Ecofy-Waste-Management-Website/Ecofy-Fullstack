import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const rawApiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || window.location.origin;
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

const resolveRole = (mongoRole, clerkRole) => {
  const normalizedMongoRole = typeof mongoRole === "string" ? mongoRole.trim().toLowerCase() : "";
  const normalizedClerkRole = typeof clerkRole === "string" ? clerkRole.trim().toLowerCase() : "";

  if (normalizedClerkRole) return normalizedClerkRole;
  if (normalizedMongoRole) return normalizedMongoRole;
  return "customer";
};

const buildApiUrl = (path) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoaded, user } = useUser();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const checkRole = async () => {
      try {
        const allowed = allowedRoles.map((role) => role.toLowerCase());
        let role = resolveRole("", user.publicMetadata?.role);

        const response = await fetch(buildApiUrl(`/users/${user.id}`));

        if (response.ok) {
          const data = await response.json();
          role = resolveRole(data.user?.role, user.publicMetadata?.role);
        } else {
          console.warn("ProtectedRoute: User profile lookup failed, using Clerk metadata role");
        }

        if (allowed.includes(role)) {
          setAuthorized(true);
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