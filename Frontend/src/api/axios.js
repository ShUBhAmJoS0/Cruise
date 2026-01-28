import axios from "axios";
import { auth } from "../firebase.js";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: false
});

api.interceptors.request.use(async (config) => {
  // console.log("interceptor triggered")
  const user = auth.currentUser;

  if (user) {

    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default api;
