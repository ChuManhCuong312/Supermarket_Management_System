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
};

export default OrderService;