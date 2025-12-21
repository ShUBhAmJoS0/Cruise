import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firbase.js";
import { onAuthStateChanged } from "firebase/auth";
import api from "../api/axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     
  const [role, setRole] = useState(null);      
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
      try {
        const token = await currentUser.getIdToken();
        const res = await api.get("/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(res.data.userType); 
      } catch {
        setRole(null);
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null); 
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
