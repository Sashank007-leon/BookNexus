// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();

  // Allow access if no user is logged in or if the user is non-admin
  if (!user) return children;
  
  // Redirect if user is an admin and trying to access non-admin route
  if (requireAdmin && !user.isAdmin) return <Navigate to="/" />;

  // Redirect to admin dashboard if user is an admin but tries to access non-admin page
  if (!requireAdmin && user.isAdmin) return <Navigate to="/admin/dashboard" />;

  return children;
};

export default ProtectedRoute;
