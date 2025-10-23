import axiosClient from "../../api/axiosClient";

const API_BASE = "http://localhost:8080/api/orderdetails";

const OrderDetailService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get(`${API_BASE}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      return [];
    }
  },

  getSortedByProductId: async (sort = "asc") => {
    try {
      const response = await axiosClient.get(`${API_BASE}/sorted/productid`, {
        params: { sort },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sorted order details:", error);
      return [];
    }
  },

  getSortedByTotalPrice: async (sort = "asc") => {
    try {
      const response = await axiosClient.get(`${API_BASE}/sorted/totalprice`, {
        params: { sort },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch sorted order details:", error);
      return [];
    }
  },

  searchOrderDetails: async (orderId, productId) => {
      try {
        const params = {};
        if (orderId) params.orderId = orderId;
        if (productId) params.productId = productId;

        const response = await axiosClient.get(`${API_BASE}/search`, { params });
        return response.data;
      } catch (error) {
        console.error("Failed to search order details:", error);
        return [];
      }
    },

  deleteOrderDetail: async (id) => {
    try {
      const response = await axiosClient.delete(`${API_BASE}/delete/${id}`);
      return response.data; // optionally return deleted object
    } catch (error) {
      console.error("Failed to delete order detail:", error);
      throw error; // let the caller handle it
    }
  },
};

export default OrderDetailService;