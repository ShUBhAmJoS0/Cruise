import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user , role, loading } = useAuth();
  const location = useLocation();
  
if (loading) return <p>Loading...</p>;
 console.log(role)
 console.log(user)
  // For admin routes, redirect to admin login if not authenticated
  if (!user) {
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login"/>;
    }
    return <Navigate to="/login"/>; 
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
   
    return <Navigate to="/unauthorized" />; 
  }
  console.log("Role missing, showing login page but no redirect loop yet");
  return children; 
};

export default ProtectedRoute;
