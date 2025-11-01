import api from './api';

// Centralized error handler — returns string
const handleApiError = (error, defaultMessage) => {
  const data = error.response?.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (data.non_field_errors) return data.non_field_errors[0];
    const firstError = Object.values(data)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  return defaultMessage;
};

const businessService = {
  // ==================== Business CRUD ====================

  /**
   * @param {Object} params - Query params (page, category, etc.)
   * @returns {Promise<Array>} List of businesses
   */
  getBusinesses: async (params = {}) => {
    try {
      const response = await api.get('/businesses/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch businesses'));
    }
  },

  /**
   * @param {number} id - Business ID
   * @returns {Promise<Object>} Business details
   */
  getBusinessById: async (id) => {
    try {
      const response = await api.get(`/businesses/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch business details'));
    }
  },

  /**
   * @param {FormData} businessData - FormData with business fields + images
   * @returns {Promise<Object>} Created business
   */
  createBusiness: async (businessData) => {
    try {
      const response = await api.post('/businesses/', businessData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create business'));
    }
  },

  /**
   * @param {number} id - Business ID
   * @param {FormData} businessData - Full update
   * @returns {Promise<Object>}
   */
  updateBusiness: async (id, businessData) => {
    try {
      const response = await api.put(`/businesses/${id}/`, businessData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update business'));
    }
  },

  /**
   * @param {number} id - Business ID
   * @param {FormData|Object} businessData - Partial update
   * @returns {Promise<Object>}
   */
  patchBusiness: async (id, businessData) => {
    try {
      const config = {};
      if (businessData instanceof FormData) {
        // Let Axios set Content-Type
      } else {
        config.headers = { 'Content-Type': 'application/json' };
      }
      const response = await api.patch(`/businesses/${id}/`, businessData, config);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update business'));
    }
  },

  /**
   * @param {number} id - Business ID
   * @returns {Promise<void>}
   */
  deleteBusiness: async (id) => {
    try {
      await api.delete(`/businesses/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete business'));
    }
  },

  // ==================== Business Images ====================

  /**
   * @param {number} id - Business ID
   * @param {File} imageFile - Image file
   * @param {string} caption - Optional caption
   * @param {boolean} isPrimary - Set as primary
   * @returns {Promise<Object>}
   */
  uploadBusinessImage: async (id, imageFile, caption = '', isPrimary = false) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (caption) formData.append('caption', caption);
      formData.append('is_primary', String(isPrimary));

      const response = await api.post(`/businesses/${id}/upload_image/`, formData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to upload image'));
    }
  },

  // ==================== Business Reviews ====================

  /**
   * @param {number} id - Business ID
   * @param {Object} params - Pagination, etc.
   * @returns {Promise<Array>}
   */
  getBusinessReviews: async (id, params = {}) => {
    try {
      const response = await api.get(`/businesses/${id}/reviews/`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch reviews'));
    }
  },

  // ==================== Location-Based ====================

  /**
   * @param {number} latitude
   * @param {number} longitude
   * @param {number} radius - in km
   * @returns {Promise<Array>}
   */
  getNearbyBusinesses: async (latitude, longitude, radius = 5) => {
    try {
      const response = await api.get('/businesses/nearby/', {
        params: { latitude, longitude, radius },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch nearby businesses'));
    }
  },

  // ==================== Contact ====================

  /**
   * @param {number} businessId
   * @param {string} message
   * @returns {Promise<Object>}
   */
  contactBusiness: async (businessId, message) => {
    try {
      const response = await api.post(`/businesses/${businessId}/contact/`, { message });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to send message'));
    }
  },

  // ==================== Categories ====================

  getCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch categories'));
    }
  },

  getPublicCategories: async () => {
    try {
      const response = await api.get('/public-categories/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch public categories'));
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories/', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create category'));
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}/`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update category'));
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete category'));
    }
  },

  // ==================== Statistics ====================

  getTopRatedBusinesses: async (period = 'all', limit = 10) => {
    try {
      const response = await api.get('/top-rated/', { params: { period, limit } });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch top rated');
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get('/statistics/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch statistics'));
    }
  },

  // ==================== Search ====================

  searchBusinesses: async (query, filters = {}) => {
    try {
      const response = await api.get('/search/', {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to search'));
    }
  },

  // ==================== User-Specific ====================

  /**
   * @returns {Promise<Array>} User's businesses
   */
  getMyBusinesses: async () => {
    try {
      const response = await api.get('/my-businesses/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch your businesses'));
    }
  },

  /**
   * @returns {Promise<Array>} User's reviews
   */
  getMyReviews: async () => {
    try {
      const response = await api.get('/my-reviews/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch your reviews'));
    }
  },
};

export default businessService;