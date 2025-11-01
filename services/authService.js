import api from "./api";

// Login function - Uses Django JWT /api/token/
const login = async (email, password) => {
  try {
    const response = await api.post("/token/", { 
      username: email,
      password 
    });
    
    return {
      token: response.data.access,
      refresh: response.data.refresh
    };
  } catch (error) {
    console.error("Login service error:", error);
    throw error.response?.data || { message: error.message || "Login failed" };
  }
};

// Signup function
const signup = async (signupData) => {
  try {
    const payload = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      password_confirm: signupData.password_confirm,
    };

    if (signupData.phone_number) {
      payload.phone_number = signupData.phone_number;
    }

    console.log("📤 Sending signup request:", { ...payload, password: "[HIDDEN]", password_confirm: "[HIDDEN]" });

    const response = await api.post("/register/", payload);
    
    console.log("✅ Signup successful:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ Signup service error:", {
      isNetworkError: error.isNetworkError,
      message: error.message,
      hasResponse: !!error.response,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // Handle network errors specifically
    if (error.isNetworkError) {
      throw { 
        message: "Cannot connect to server. Is your Django backend running on http://localhost:8000?",
        detail: error.message
      };
    }
    
    // Handle HTTP errors
    if (error.response) {
      throw error.response.data || { message: "Signup failed" };
    }
    
    // Handle other errors
    throw { message: error.message || "An unexpected error occurred" };
  }
};

// Get user profile
const getProfile = async () => {
  try {
    const response = await api.get("/profile/");
    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    
    if (error.isNetworkError) {
      throw { message: "Cannot connect to server" };
    }
    
    throw error.response?.data || { message: "Failed to fetch profile" };
  }
};

// Get user dashboard data
const getDashboard = async () => {
  try {
    const response = await api.get("/dashboard/");
    return response.data;
  } catch (error) {
    if (error.isNetworkError) {
      throw { message: "Cannot connect to server" };
    }
    
    throw error.response?.data || { message: "Failed to fetch dashboard" };
  }
};

// Refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem(
      process.env.NEXT_PUBLIC_JWT_REFRESH_KEY || "refresh_token"
    );
    
    if (!refresh) {
      throw new Error("No refresh token available");
    }

    const response = await api.post("/token/refresh/", { refresh });
    const newAccessToken = response.data.access;
    
    localStorage.setItem(
      process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token",
      newAccessToken
    );
    
    return newAccessToken;
  } catch (error) {
    logout();
    
    if (error.isNetworkError) {
      throw { message: "Cannot connect to server" };
    }
    
    throw error.response?.data || { message: "Session expired" };
  }
};

// Logout
const logout = () => {
  localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token");
  localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_REFRESH_KEY || "refresh_token");
};

export default {
  login,
  signup,
  getProfile,
  getDashboard,
  refreshToken,
  logout,
};