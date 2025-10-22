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
};

export default OrderDetailService;