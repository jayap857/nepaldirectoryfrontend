import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Add timeout
});

// Add a request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(
        process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token"
      );
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error info, handle empty or non-Axios errors
    if (error && (error.config || error.response || error.request)) {
      // Log key error properties directly for better visibility
      console.error("API Interceptor Error:", {
        url: error.config?.url,
        method: error.config?.method,
        hasResponse: !!error.response,
        hasRequest: !!error.request,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      // Log the error object itself for deep inspection
      console.error("API Interceptor Error (object):", error);
      // Log error as string if available
      if (typeof error.toString === 'function') {
        console.error("API Interceptor Error (toString):", error.toString());
      }
      // Log error stack if available
      if (error.stack) {
        console.error("API Interceptor Error (stack):", error.stack);
      }
    } else {
      // Handle unexpected error shapes
      console.error("API Interceptor Error: Unknown error format", error);
      if (typeof error?.toString === 'function') {
        console.error("API Interceptor Error (toString):", error.toString());
      }
      if (error?.stack) {
        console.error("API Interceptor Error (stack):", error.stack);
      }
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error Response:", error.response.status, error.response.data);
      
      // Pass through the error response data
      return Promise.reject(error);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error - No Response:", error.message);
      
      // Create a structured error for network failures
      const networkError = new Error("Cannot connect to server");
      networkError.isNetworkError = true;
      networkError.originalError = error;
      return Promise.reject(networkError);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Setup Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default api;