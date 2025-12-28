import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firbase.js";
import { onAuthStateChanged } from "firebase/auth";
import api from "../api/axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     
  const [role, setRole] = useState(null);      
  const [loading, setLoading] = useState(true);
  const[dbuser,setDbuser] = useState(null);


useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    setUser(currentUser);

    try {
      const token = await currentUser.getIdToken(true); 
      const res = await api.get("/auth/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRole(res.data.user.userType);
      setDbuser(res.data.user)
      console.log(dbuser)
      console.log(role)
      setLoading(false); 
    } catch (error) {
      console.error("Role fetch failed", error);
      setRole(null);
      setLoading(true); 
    }
  });

  return () => unsubscribe();
}, []);
useEffect(() => {
  if (!user || role || loading) return;

  const recoverRole = async () => {
    try {
      const token = await user.getIdToken(true);
      const res = await api.get("/auth/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(res.data.user.userType);
    } catch (e) {
      console.error("Role recovery failed", e);
    }
  };

  recoverRole();
}, [user, role, loading]);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null); 
  };

  return (
    <AuthContext.Provider value={{ dbuser,setDbuser, user, role, setRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
