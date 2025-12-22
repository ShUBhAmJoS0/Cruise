import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user , role, loading } = useAuth();
if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login"/>; 

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(role)
    return <Navigate to="/unauthorized" />; 
  }
  console.log("Role missing, showing login page but no redirect loop yet");
  return children; 
};

export default ProtectedRoute;
