"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/authService";

interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  profile_picture?: string;
  is_business_owner: boolean;
  is_customer: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  date_joined: string;
  review_count: number;
  business_count: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (userData: any) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: () => {},
  signup: async () => ({ success: false }),
  loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Context provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem(
      process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token"
    );
    
    if (token) {
      try {
        // Try to fetch user profile with existing token
        const userInfo = await authService.getProfile();
        setUser(userInfo);
        setIsAuthenticated(true);
        setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);
        console.log("User authenticated:", userInfo);
      } catch (error) {
        console.log("Token invalid, trying refresh...");
        // Try to refresh token
        try {
          await authService.refreshToken();
          // Retry getting profile after refresh
          const userInfo = await authService.getProfile();
          setUser(userInfo);
          setIsAuthenticated(true);
          setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);
          console.log("User authenticated after refresh:", userInfo);
        } catch (refreshError) {
          console.log("Refresh failed, logging out");
          // If refresh also fails, clear everything
          localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token");
          localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_REFRESH_KEY || "refresh_token");
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    }
    
    setLoading(false);
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt:", email);
      const res = await authService.login(email, password);
      const { token, refresh } = res;
      
      console.log("Login response:", { token: token ? "exists" : "missing", refresh: refresh ? "exists" : "missing" });
      
      // Store both tokens
      localStorage.setItem(
        process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "access_token",
        token
      );
      localStorage.setItem(
        process.env.NEXT_PUBLIC_JWT_REFRESH_KEY || "refresh_token",
        refresh
      );

      // Fetch user info
      const userInfo = await authService.getProfile();
      console.log("User info fetched:", userInfo);
      
      setUser(userInfo);
      setIsAuthenticated(true);
      setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);

      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err);
      return { 
        success: false, 
        message: err.detail || err.message || "Login failed" 
      };
    }
  };

  // Signup
  const signup = async (userData: any) => {
    try {
      console.log("Signup attempt:", userData.username, userData.email);
      const result = await authService.signup(userData);
      console.log("Signup successful:", result);
      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Django returns validation errors as objects
      let errorMessage = "Signup failed";
      
      if (typeof err === 'object' && err !== null) {
        // Extract first error message
        if (err.username) {
          errorMessage = Array.isArray(err.username) ? err.username[0] : err.username;
        } else if (err.email) {
          errorMessage = Array.isArray(err.email) ? err.email[0] : err.email;
        } else if (err.password) {
          errorMessage = Array.isArray(err.password) ? err.password[0] : err.password;
        } else if (err.password_confirm) {
          errorMessage = Array.isArray(err.password_confirm) ? err.password_confirm[0] : err.password_confirm;
        } else if (err.detail) {
          errorMessage = err.detail;
        } else {
          // Get first error from any field
          const firstError = Object.values(err)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        signup,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};