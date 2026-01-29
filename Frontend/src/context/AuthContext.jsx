import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, signOut } from "../firebase.js";
import api from "../api/axios.js";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbuser, setDbuser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setDbuser(null);
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
        console.log(res);


        if (res.data && res.data.user) {
          setRole(res.data.user.userType);
          setDbuser(res.data.user);
          console.log("Role set:", res.data.user.userType);
        } else {

          throw new Error("User data not found in response");
        }

        setLoading(false);
      } catch (error) {
        console.error("Role fetch failed", error);
        // If getting role/user fails, we might still be logged in to Firebase but our backend is unreachable or token invalid.
        // We shouldn't blindly kill the user session unless it's a 401/403.
        // For now, let's allow the user state to persist so ProtectedRoute doesn't redirect immediately.
        // But if we strictly need role, we might need a "roleLoading" state.

        // Retrying logic or handling specific error codes would be better.
        // If we can't get the user role, we can't let them into role-protected routes.
        if (error.response && error.response.status === 404) {
          // User doesn't exist in DB - maybe sign out?
          setUser(null);
          setRole(null);
          setDbuser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (!user || role || loading) return;

    const recoverRole = async () => {
      try {
        const token = await user.getIdToken();
        const res = await api.get("/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.user) {
          setRole(res.data.user.userType);
          setDbuser(res.data.user);
        }
      } catch (e) {
        console.error("Role recovery failed", e);
      }
    };

    recoverRole();
  }, [user, role, loading]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setDbuser(null);
  };

  return (
    <AuthContext.Provider value={{ dbuser, setDbuser, setUser, user, role, setRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);