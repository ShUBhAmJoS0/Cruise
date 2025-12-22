import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:5000", 
  withCredentials: false
});

api.interceptors.request.use(async (config) => {
  console.log("interceptor triggered")
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
