import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  const role = user?.publicMetadata?.role || "user";

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Send back to home if unauthorized
  }

  return children;
};

export default ProtectedRoute;