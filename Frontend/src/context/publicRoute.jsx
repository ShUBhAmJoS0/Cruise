import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const {user, role, loading } = useAuth(); 

if (loading) return <p>Loading...</p>;

  if (user) {
     console.log(role)
    
 
    switch (role) {
       
      case "Admin":
        return <Navigate to="/admin/dashboard" />;
      case "Artist":
        return <Navigate to="/artist/Request" />;
      default:
        return <Navigate to="/events" />;
    }
  }
    console.log("Role missing, showing login page but no redirect loop yet");
  return children; 
};

export default PublicRoute;
