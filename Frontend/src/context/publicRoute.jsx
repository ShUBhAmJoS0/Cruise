import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  // const { user, loading } = useAuth();

  // // 1. Wait until auth state is loaded
  // if (loading) return <p></p>;

  // // 2. If user is logged in, redirect to dashboard / events
  // if (user) return <Navigate to="/events" />;

  // // 3. If not logged in, render the auth page
  return children;
};

export default PublicRoute;
