import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  // const { user, loading } = useAuth();

  // if (loading) return <p></p>;

  // if (!user) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;
