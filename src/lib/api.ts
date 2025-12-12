import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

console.log("🔗 API URL:", API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    const { data } = await api.get("/csrf-token");
    api.defaults.headers.common["CSRF-Token"] = data.csrfToken;
    console.log("✅ CSRF Token fetched");
  } catch (error) {
    console.error("❌ Error fetching CSRF token:", error);
  }
};

// Request interceptor for debug
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
