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
    baseURL: ("TURBOPACK compile-time value", "http://localhost:8000/api")
});
// Add a request interceptor to attach JWT token if available
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem(("TURBOPACK compile-time value", "access_token"));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
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
// Login function - FIXED to use /api/token/
const login = async (email, password)=>{
    try {
        // Django JWT expects 'username' field, but you might use email as username
        // Adjust based on your Django User model (email vs username)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/token/", {
            username: email,
            password
        });
        // Django JWT returns { access, refresh }
        return {
            token: response.data.access,
            refresh: response.data.refresh
        };
    } catch (error) {
        throw error.response?.data || {
            message: "Login failed"
        };
    }
};
// Signup function
const signup = async (signupData)=>{
    try {
        // Backend expects: username, email, password, password_confirm, phone_number (optional)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/register/", {
            username: signupData.username,
            email: signupData.email,
            password: signupData.password,
            password_confirm: signupData.password_confirm,
            phone_number: signupData.phone_number || ""
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Signup failed"
        };
    }
};
// Get user profile (JWT automatically attached via interceptor)
const getProfile = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/profile/");
        // Backend returns full UserProfileSerializer
        return response.data;
    } catch (error) {
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
        // Update access token in storage
        localStorage.setItem(("TURBOPACK compile-time value", "access_token"), newAccessToken);
        return newAccessToken;
    } catch (error) {
        // If refresh fails, clear tokens and logout
        logout();
        throw error.response?.data || {
            message: "Session expired"
        };
    }
};
// Logout
const logout = ()=>{
    localStorage.removeItem(("TURBOPACK compile-time value", "access_token"));
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
"[project]/contexts/AuthContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const AuthProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load user on app start
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const token = localStorage.getItem(("TURBOPACK compile-time value", "access_token"));
            if (token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile().then({
                    "AuthProvider.useEffect": (res)=>{
                        setUser(res);
                        setIsAuthenticated(true);
                    }
                }["AuthProvider.useEffect"]).catch({
                    "AuthProvider.useEffect": ()=>{
                        // Try to refresh token
                        __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].refreshToken().then({
                            "AuthProvider.useEffect": ()=>{
                                // Retry getting profile after refresh
                                return __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile();
                            }
                        }["AuthProvider.useEffect"]).then({
                            "AuthProvider.useEffect": (res)=>{
                                setUser(res);
                                setIsAuthenticated(true);
                            }
                        }["AuthProvider.useEffect"]).catch({
                            "AuthProvider.useEffect": ()=>{
                                // If refresh also fails, clear everything
                                localStorage.removeItem(("TURBOPACK compile-time value", "access_token"));
                                localStorage.removeItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token");
                                setUser(null);
                                setIsAuthenticated(false);
                            }
                        }["AuthProvider.useEffect"]);
                    }
                }["AuthProvider.useEffect"]).finally({
                    "AuthProvider.useEffect": ()=>setLoading(false)
                }["AuthProvider.useEffect"]);
            } else {
                setLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    // Login
    const login = async (email, password)=>{
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].login(email, password);
            const { token, refresh } = res;
            // Store both tokens
            localStorage.setItem(("TURBOPACK compile-time value", "access_token"), token);
            localStorage.setItem(("TURBOPACK compile-time value", "refresh_token") || "refresh_token", refresh);
            // Fetch user info
            const userInfo = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getProfile();
            setUser(userInfo);
            setIsAuthenticated(true);
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].signup(userData);
            return {
                success: true
            };
        } catch (err) {
            console.error("Signup error:", err);
            // Django returns validation errors as objects
            let errorMessage = "Signup failed";
            if (typeof err === 'object') {
                // Extract first error message
                const firstError = Object.values(err)[0];
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0];
                } else if (typeof firstError === 'string') {
                    errorMessage = firstError;
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
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated,
            login,
            logout,
            signup,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.js",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "MIOyihIJe1jbesOAPrjh1+/HIzc=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_53f46e6d._.js.map