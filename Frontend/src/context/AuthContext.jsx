import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firbase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  
  return (
    <AuthContext.Provider value={{ user, logout,loading}}>
      {children}
    </AuthContext.Provider>
  );
  
};
export const useAuth = () => useContext(AuthContext)
