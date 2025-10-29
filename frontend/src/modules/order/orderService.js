import axiosClient from "../../api/axiosClient";

const API_BASE = "http://localhost:8080/api/orders";
const OrderService = {
  getActiveOrders: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE}/active`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch active orders:", error);
      return [];
    }
  },

  getCanceledOrders: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE}/canceled`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch canceled orders:", error);
      return [];
    }
  },

  getHiddenOrders: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE}/hidden`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch hidden orders:", error);
      return [];
    }
  },

    // NEW: Get all deleted orders (canceled + hidden)
    getDeletedOrders: async () => {
      try {
        const [canceled, hidden] = await Promise.all([
          axiosClient.get(`${API_BASE}/canceled`),
          axiosClient.get(`${API_BASE}/hidden`)
        ]);
        return [...canceled.data, ...hidden.data];
      } catch (error) {
        console.error("Failed to fetch deleted orders:", error);
        return [];
      }
    },

  getSortedByBuyDate: async (sort = "asc") => {
    try {
      const response = await axiosClient.get(`${API_BASE}/sorted/buydate?sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error("Failed to sort by date:", error);
      return [];
    }
  },

  getSortedByTotalAmount: async (sort = "asc") => {
    try {
      const response = await axiosClient.get(`${API_BASE}/sorted/totalamount?sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error("Failed to sort by total amount:", error);
      return [];
    }
  },

  searchOrders: async (customerId, employeeId, orderDate) => {
    try {
      const params = new URLSearchParams();
      if (customerId) params.append("customerId", customerId);
      if (employeeId) params.append("employeeId", employeeId);
      if (orderDate) params.append("orderDate", orderDate);

      const response = await axiosClient.get(`${API_BASE}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Failed to search orders:", error);
      return [];
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axiosClient.post(`${API_BASE}/add`, orderData);
      return response.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  },

  updateOrder: async (orderId, orderData) => {
    try {
      const response = await axiosClient.put(`${API_BASE}/update/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error("Failed to update order:", error);
      throw error;
    }
  },

   // NEW: Cancel order (restore stock)
    cancelOrder: async (orderId) => {
      try {
        const response = await axiosClient.delete(`${API_BASE}/cancel/${orderId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to cancel order:", error);
        throw error;
      }
    },

    // NEW: Hide order (don't restore stock)
    hideOrder: async (orderId) => {
      try {
        const response = await axiosClient.delete(`${API_BASE}/hide/${orderId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to hide order:", error);
        throw error;
      }
    },

    // NEW: Restore order
    restoreOrder: async (orderId) => {
      try {
        const response = await axiosClient.put(`${API_BASE}/restore/${orderId}`);
        return response.data;
      } catch (error) {
        console.error("Failed to restore order:", error);
        throw error;
      }
    },

    // ========================================
      // NEW: PAGINATION METHODS FOR ACTIVE ORDERS
      // ========================================

      /**
       * Get active orders with pagination (deletedType IS NULL)
       * @param {number} page - Page number (default: 0)
       * @param {number} size - Page size (default: 10)
       * @returns {Promise<Object>} Page object with content, totalPages, etc.
       */
      getActiveOrdersByPage: async (page = 0, size = 10) => {
        try {
          const response = await axiosClient.get(`${API_BASE}/active/page`, {
            params: { page, size }
          });
          return response.data;
        } catch (error) {
          console.error("Failed to get paginated active orders:", error);
          throw error;
        }
      },

      /**
       * Search active orders with pagination
       * @param {number} customerId - Customer ID (optional)
       * @param {number} employeeId - Employee ID (optional)
       * @param {string} orderDate - Order date in format yyyy-MM-dd (optional)
       * @param {number} page - Page number (default: 0)
       * @param {number} size - Page size (default: 10)
       * @returns {Promise<Object>} Page object with filtered results
       */
      searchActiveOrdersByPage: async (customerId, employeeId, orderDate, page = 0, size = 10) => {
        try {
          const params = { page, size };
          if (customerId) params.customerId = customerId;
          if (employeeId) params.employeeId = employeeId;
          if (orderDate) params.orderDate = orderDate;

          const response = await axiosClient.get(`${API_BASE}/active/search/page`, { params });
          return response.data;
        } catch (error) {
          console.error("Failed to search paginated active orders:", error);
          throw error;
        }
      },

      // ========================================
      // NEW: PAGINATION METHODS FOR DELETED ORDERS
      // ========================================

      /**
       * Get deleted orders with pagination (deletedType IS NOT NULL)
       * @param {number} page - Page number (default: 0)
       * @param {number} size - Page size (default: 10)
       * @returns {Promise<Object>} Page object with content, totalPages, etc.
       */
      getDeletedOrdersByPage: async (page = 0, size = 10) => {
        try {
          const response = await axiosClient.get(`${API_BASE}/deleted/page`, {
            params: { page, size }
          });
          return response.data;
        } catch (error) {
          console.error("Failed to get paginated deleted orders:", error);
          throw error;
        }
      },

      /**
       * Search deleted orders with pagination
       * @param {number} customerId - Customer ID (optional)
       * @param {number} employeeId - Employee ID (optional)
       * @param {string} orderDate - Order date in format yyyy-MM-dd (optional)
       * @param {number} page - Page number (default: 0)
       * @param {number} size - Page size (default: 10)
       * @returns {Promise<Object>} Page object with filtered results
       */
      searchDeletedOrdersByPage: async (customerId, employeeId, orderDate, page = 0, size = 10) => {
        try {
          const params = { page, size };
          if (customerId) params.customerId = customerId;
          if (employeeId) params.employeeId = employeeId;
          if (orderDate) params.orderDate = orderDate;

          const response = await axiosClient.get(`${API_BASE}/deleted/search/page`, { params });
          return response.data;
        } catch (error) {
          console.error("Failed to search paginated deleted orders:", error);
          throw error;
        }
      },
};

export default OrderService;