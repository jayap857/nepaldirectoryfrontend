// services/reviewService.js
import api from "./api";

// ---- Centralised error handler ----
const handleApiError = (error, defaultMessage) => {
  const data = error.response?.data;
  if (data) {
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (data.non_field_errors) return data.non_field_errors[0];
    const first = Object.values(data)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  return defaultMessage || "An error occurred";
};

const reviewService = {
  // ==== FETCH ====
  getReviews: async (params = {}) => {
    try {
      const { data } = await api.get("/reviews/", { params });
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch reviews"));
    }
  },

  getBusinessReviews: async (businessId) => {
    try {
      const { data } = await api.get(`/businesses/${businessId}/reviews/`);
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch business reviews"));
    }
  },

  getReviewById: async (id) => {
    try {
      const { data } = await api.get(`/reviews/${id}/`);
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch review"));
    }
  },

  // ==== CRUD ====
  createReview: async (businessId, reviewData) => {
    try {
      const { data } = await api.post(
        `/businesses/${businessId}/reviews/`,
        reviewData
      );
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to create review"));
    }
  },

  updateReview: async (id, reviewData) => {
    try {
      const { data } = await api.put(`/reviews/${id}/`, reviewData);
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update review"));
    }
  },

  patchReview: async (id, reviewData) => {
    try {
      const { data } = await api.patch(`/reviews/${id}/`, reviewData);
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update review"));
    }
  },

  deleteReview: async (id) => {
    try {
      await api.delete(`/reviews/${id}/`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to delete review"));
    }
  },

  // ==== STATS ====
  getBusinessRatingStats: async (businessId) => {
    try {
      const { data } = await api.get(
        `/businesses/${businessId}/rating-stats/`
      );
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch rating stats"));
    }
  },

  // ==== MODERATION ====
  flagReview: async (id, reason) => {
    try {
      const { data } = await api.post(`/reviews/${id}/flag/`, { reason });
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to flag review"));
    }
  },

  // ==== USER SPECIFIC ====
  getMyReviews: async () => {
    try {
      const { data } = await api.get("/my-reviews/");
      return data;
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch your reviews"));
    }
  },
};

export default reviewService;