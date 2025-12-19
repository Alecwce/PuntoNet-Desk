import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Only log in development
if (import.meta.env.DEV) {
  console.log("🔗 API URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let csrfToken: string | null = null;

// Function to fetch CSRF token
export const fetchCsrfToken = async () => {
  try {
    const { data } = await axios.get(
      `${API_URL.replace("/api", "")}/csrf-token`,
      {
        withCredentials: true,
      }
    );
    csrfToken = data.csrfToken;
    if (import.meta.env.DEV) {
      console.log("✅ CSRF Token fetched");
    }
  } catch (error) {
    console.error("❌ Error fetching CSRF token:", error);
  }
};

// Auto-refresh CSRF token every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    fetchCsrfToken();
  }, 300000); // 5 minutes
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
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
