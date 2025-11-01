(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Create Axios instance
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "https://nepal-directory-01.onrender.com/api") || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000
});
// Add a request interceptor to attach JWT token if available
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem(("TURBOPACK compile-time value", "access_token") || "access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add a response interceptor to handle errors
api.interceptors.response.use((response)=>{
    return response;
}, (error)=>{
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
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/authService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api.js [app-client] (ecmascript)");
;
// Login function - Uses Django JWT /api/token/
const login = async (email, password)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/token/", {
            username: email,
            password
        });
        return {
            token: response.data.access,
            refresh: response.data.refresh
        };
    } catch (error) {
        console.error("Login service error:", error);
        throw error.response?.data || {
            message: error.message || "Login failed"
        };
    }
};
// Signup function
const signup = async (signupData)=>{
    try {
        const payload = {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
            password_confirm: signupData.password_confirm
        };
        if (signupData.phone_number) {
            payload.phone_number = signupData.phone_number;
        }
        console.log("📤 Sending signup request:", {
            ...payload,
            password: "[HIDDEN]",
            password_confirm: "[HIDDEN]"
        });
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/register/", payload);
        console.log("✅ Signup successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Signup service error:", {
            isNetworkError: error.isNetworkError,
            message: error.message,
            hasResponse: !!error.response,
            status: error.response?.status,
            data: error.response?.data
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
            throw error.response.data || {
                message: "Signup failed"
            };
        }
        // Handle other errors
        throw {
            message: error.message || "An unexpected error occurred"
        };
    }
};
// Get user profile
const getProfile = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/profile/");
        return response.data;
    } catch (error) {
        console.error("Profile fetch error:", error);
        if (error.isNetworkError) {
            throw {
                message: "Cannot connect to server"
            };
        }
        throw error.response?.data || {
            message: "Failed to fetch profile"
        };
    }
};
// Get user dashboard data
const getDashboard = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/dashboard/");
        return response.data;
    } catch (error) {
        if (error.isNetworkError) {
            throw {
                message: "Cannot connect to server"
            };
        }
        throw error.response?.data || {
            message: "Failed to fetch dashboard"
        };
    }
};
// Refresh token
const refreshToken = async ()=>{
    try {
        const refresh = localStorage.getItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token");
        if (!refresh) {
            throw new Error("No refresh token available");
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/token/refresh/", {
            refresh
        });
        const newAccessToken = response.data.access;
        localStorage.setItem(("TURBOPACK compile-time value", "access_token") || "access_token", newAccessToken);
        return newAccessToken;
    } catch (error) {
        logout();
        if (error.isNetworkError) {
            throw {
                message: "Cannot connect to server"
            };
        }
        throw error.response?.data || {
            message: "Session expired"
        };
    }
};
// Logout
const logout = ()=>{
    localStorage.removeItem(("TURBOPACK compile-time value", "access_token") || "access_token");
    localStorage.removeItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token");
};
const __TURBOPACK__default__export__ = {
    login,
    signup,
    getProfile,
    getDashboard,
    refreshToken,
    logout
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/authService.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: async ()=>({
            success: false
        }),
    logout: ()=>{},
    signup: async ()=>({
            success: false
        }),
    loading: true
});
const AuthProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load user on app start
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            checkAuth();
        }
    }["AuthProvider.useEffect"], []);
    const checkAuth = async ()=>{
        const token = localStorage.getItem(("TURBOPACK compile-time value", "access_token") || "access_token");
        if (token) {
            try {
                // Try to fetch user profile with existing token
                const userInfo = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile();
                setUser(userInfo);
                setIsAuthenticated(true);
                setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);
                console.log("User authenticated:", userInfo);
            } catch (error) {
                console.log("Token invalid, trying refresh...");
                // Try to refresh token
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].refreshToken();
                    // Retry getting profile after refresh
                    const userInfo = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile();
                    setUser(userInfo);
                    setIsAuthenticated(true);
                    setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);
                    console.log("User authenticated after refresh:", userInfo);
                } catch (refreshError) {
                    console.log("Refresh failed, logging out");
                    // If refresh also fails, clear everything
                    localStorage.removeItem(("TURBOPACK compile-time value", "access_token") || "access_token");
                    localStorage.removeItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token");
                    setUser(null);
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                }
            }
        }
        setLoading(false);
    };
    // Login
    const login = async (email, password)=>{
        try {
            console.log("Login attempt:", email);
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].login(email, password);
            const { token, refresh } = res;
            console.log("Login response:", {
                token: token ? "exists" : "missing",
                refresh: refresh ? "exists" : "missing"
            });
            // Store both tokens
            localStorage.setItem(("TURBOPACK compile-time value", "access_token") || "access_token", token);
            localStorage.setItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token", refresh);
            // Fetch user info
            const userInfo = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile();
            console.log("User info fetched:", userInfo);
            setUser(userInfo);
            setIsAuthenticated(true);
            setIsAdmin(userInfo.is_staff || userInfo.is_superuser || false);
            return {
                success: true
            };
        } catch (err) {
            console.error("Login error:", err);
            return {
                success: false,
                message: err.detail || err.message || "Login failed"
            };
        }
    };
    // Signup
    const signup = async (userData)=>{
        try {
            console.log("Signup attempt:", userData.username, userData.email);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].signup(userData);
            console.log("Signup successful:", result);
            return {
                success: true
            };
        } catch (err) {
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
            return {
                success: false,
                message: errorMessage
            };
        }
    };
    // Logout
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].logout();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated,
            isAdmin,
            login,
            logout,
            signup,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "/qrzQ9lsFSQqXMffRVmwLmHIr2M=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/ToastContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useToast = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};
_s(useToast, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const ToastProvider = ({ children })=>{
    _s1();
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[showToast]": (type, message)=>{
            const toastId = `${id}-${crypto.randomUUID()}`;
            const newToast = {
                id: toastId,
                type,
                message
            };
            setToasts({
                "ToastProvider.useCallback[showToast]": (prev)=>[
                        ...prev,
                        newToast
                    ]
            }["ToastProvider.useCallback[showToast]"]);
            setTimeout({
                "ToastProvider.useCallback[showToast]": ()=>{
                    hideToast(toastId);
                }
            }["ToastProvider.useCallback[showToast]"], 5000);
        }
    }["ToastProvider.useCallback[showToast]"], [
        id
    ]);
    const hideToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[hideToast]": (id)=>{
            setToasts({
                "ToastProvider.useCallback[hideToast]": (prev)=>prev.filter({
                        "ToastProvider.useCallback[hideToast]": (toast)=>toast.id !== id
                    }["ToastProvider.useCallback[hideToast]"])
            }["ToastProvider.useCallback[hideToast]"]);
        }
    }["ToastProvider.useCallback[hideToast]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: {
            showToast,
            hideToast
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-4 right-4 z-50 space-y-2 max-w-md",
                role: "region",
                "aria-live": "polite",
                "aria-label": "Notifications",
                children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "alert",
                        "aria-live": "assertive",
                        className: `p-4 rounded-lg shadow-lg flex items-start gap-3 border animate-in slide-in-from-right-full duration-300 ${toast.type === "success" ? "bg-green-50 border-green-200" : toast.type === "error" ? "bg-red-50 border-red-200" : toast.type === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0",
                                children: [
                                    toast.type === "success" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-green-600",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/contexts/ToastContext.tsx",
                                            lineNumber: 92,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/contexts/ToastContext.tsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    toast.type === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-red-600",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/contexts/ToastContext.tsx",
                                            lineNumber: 108,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/contexts/ToastContext.tsx",
                                        lineNumber: 101,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    toast.type === "warning" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-yellow-600",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        }, void 0, false, {
                                            fileName: "[project]/contexts/ToastContext.tsx",
                                            lineNumber: 124,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/contexts/ToastContext.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    toast.type === "info" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-blue-600",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        "aria-hidden": "true",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/contexts/ToastContext.tsx",
                                            lineNumber: 140,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/contexts/ToastContext.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/contexts/ToastContext.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-sm font-medium ${toast.type === "success" ? "text-green-800" : toast.type === "error" ? "text-red-800" : toast.type === "warning" ? "text-yellow-800" : "text-blue-800"}`,
                                    children: toast.message
                                }, void 0, false, {
                                    fileName: "[project]/contexts/ToastContext.tsx",
                                    lineNumber: 152,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/contexts/ToastContext.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>hideToast(toast.id),
                                className: `flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition ${toast.type === "success" ? "text-green-600" : toast.type === "error" ? "text-red-600" : toast.type === "warning" ? "text-yellow-600" : "text-blue-600"}`,
                                "aria-label": "Close notification",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M6 18L18 6M6 6l12 12"
                                    }, void 0, false, {
                                        fileName: "[project]/contexts/ToastContext.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/contexts/ToastContext.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/contexts/ToastContext.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, toast.id, true, {
                        fileName: "[project]/contexts/ToastContext.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/contexts/ToastContext.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/contexts/ToastContext.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ToastProvider, "Ecai1VAEHz/VA4rx4+gddFNoIDQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = ToastProvider;
var _c;
__turbopack_context__.k.register(_c, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b3d4c148._.js.map