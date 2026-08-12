import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Automatically inject Authorization Bearer token header if present in localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("AccessToken");
      console.error("Unauthorized request. Clearing local session token.");
    }

    if (status === 403) {
      console.error("Forbidden resource access");
    }

    if (status === 404) {
      console.error("Requested endpoint not found");
    }

    if (status >= 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
