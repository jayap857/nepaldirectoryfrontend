import api from "./api";

// ============================================
// DASHBOARD & STATISTICS
// ============================================

const getAdminStats = async () => {
  try {
    const [stats, categories] = await Promise.all([
      api.get("/statistics/"),
      api.get("/categories/"),
    ]);

    return {
      total_businesses: stats.data.total_businesses || 0,
      total_users: stats.data.total_users || 0,
      total_reviews: stats.data.total_reviews || 0,
      total_categories: categories.data.length || 0,
      pending_businesses: stats.data.pending_businesses || 0,
      flagged_reviews: stats.data.flagged_reviews || 0,
      new_users_this_month: stats.data.new_users_this_month || 0,
      new_businesses_this_month: stats.data.new_businesses_this_month || 0
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch admin stats" };
  }
};

const getRecentActivities = async () => {
  try {
    const response = await api.get("/activities/recent/");
    return response.data || [];
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch recent activities" };
  }
};

// ============================================
// CATEGORY MANAGEMENT (Your backend has this!)
// ============================================

const getAllCategories = async (params = {}) => {
  try {
    const response = await api.get("/categories/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch categories" };
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch category" };
  }
};

const createCategory = async (categoryData) => {
  try {
    // Your backend: POST /api/categories/ (requires is_staff)
    const response = await api.post("/categories/", categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create category" };
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    // Your backend: PUT /api/categories/{id}/ (requires is_staff)
    const response = await api.put(`/categories/${id}/`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update category" };
  }
};

const deleteCategory = async (id) => {
  try {
    // Your backend: DELETE /api/categories/{id}/ (requires is_staff)
    const response = await api.delete(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete category" };
  }
};

// ============================================
// BUSINESS MANAGEMENT
// ============================================

const getAllBusinessesAdmin = async (params = {}) => {
  try {
    // Get all businesses including inactive ones
    const response = await api.get("/businesses/", { 
      params: {
        ...params,
        // Remove the is_active filter to see all businesses
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch businesses" };
  }
};

const approveBusiness = async (id) => {
  try {
    // Your backend: PATCH /api/businesses/{id}/
    const response = await api.patch(`/businesses/${id}/`, { 
      is_active: true 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to approve business" };
  }
};

const rejectBusiness = async (id) => {
  try {
    // Your backend: PATCH /api/businesses/{id}/
    const response = await api.patch(`/businesses/${id}/`, { 
      is_active: false 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reject business" };
  }
};

const verifyBusiness = async (id) => {
  try {
    // Your backend: PATCH /api/businesses/{id}/
    const response = await api.patch(`/businesses/${id}/`, { 
      is_verified: true 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to verify business" };
  }
};

const unverifyBusiness = async (id) => {
  try {
    // Your backend: PATCH /api/businesses/{id}/
    const response = await api.patch(`/businesses/${id}/`, { 
      is_verified: false 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to unverify business" };
  }
};

const deleteBusinessAdmin = async (id) => {
  try {
    // Your backend: DELETE /api/businesses/{id}/ (soft delete - sets is_active=False)
    const response = await api.delete(`/businesses/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete business" };
  }
};

// ============================================
// REVIEW MANAGEMENT
// ============================================

const getAllReviewsAdmin = async (params = {}) => {
  try {
    // Your backend: GET /api/reviews/
    const response = await api.get("/reviews/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch reviews" };
  }
};

const getFlaggedReviews = async () => {
  try {
    // Your Review model has is_flagged field
    // But you need to add this endpoint OR filter client-side
    const response = await api.get("/reviews/", { 
      params: { is_flagged: true } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch flagged reviews" };
  }
};

const deleteReviewAdmin = async (id) => {
  try {
    // Your backend: DELETE /api/reviews/{id}/
    // Note: Your IsReviewOwnerOrReadOnly might block this
    // You may need to update permissions for admin
    const response = await api.delete(`/reviews/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete review" };
  }
};

const unflagReview = async (id) => {
  try {
    // Your backend: PATCH /api/reviews/{id}/
    const response = await api.patch(`/reviews/${id}/`, { 
      is_flagged: false,
      flagged_reason: null
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to unflag review" };
  }
};

// ============================================
// USER MANAGEMENT
// ============================================
// NOTE: These endpoints DON'T EXIST in your backend yet!
// You'll need to add them to Django

const getAllUsers = async (params = {}) => {
  try {
    // ⚠️ This endpoint doesn't exist yet!
    // You need to create: GET /api/users/
    const response = await api.get("/users/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users (endpoint may not exist)" };
  }
};

const getUserById = async (id) => {
  try {
    // ⚠️ This endpoint doesn't exist yet!
    const response = await api.get(`/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};

const banUser = async (id, reason) => {
  try {
    // ⚠️ This endpoint doesn't exist yet!
    // You need to create: POST /api/users/{id}/ban/
    const response = await api.post(`/users/${id}/ban/`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to ban user (endpoint may not exist)" };
  }
};

const unbanUser = async (id) => {
  try {
    // ⚠️ This endpoint doesn't exist yet!
    const response = await api.post(`/users/${id}/unban/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to unban user" };
  }
};

const toggleUserStaff = async (id, isStaff) => {
  try {
    // ⚠️ This endpoint doesn't exist yet!
    const response = await api.patch(`/users/${id}/`, { 
      is_staff: isStaff 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user" };
  }
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================

export default {
  // Dashboard
  getAdminStats,
  getRecentActivities,
  
  // Categories (✅ Your backend has these!)
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Businesses (✅ Your backend has these!)
  getAllBusinessesAdmin,
  approveBusiness,
  rejectBusiness,
  verifyBusiness,
  unverifyBusiness,
  deleteBusinessAdmin,
  
  // Reviews (✅ Mostly exists, may need permission updates)
  getAllReviewsAdmin,
  getFlaggedReviews,
  deleteReviewAdmin,
  unflagReview,
  
};