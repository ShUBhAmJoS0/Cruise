import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
  withCredentials: false
});

export const getFilteredEvents = async (filters) => {
  try {
    const response = await api.get('/api/events/filter', { 
      params: filters
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    throw error;
  }
};

export default api;
