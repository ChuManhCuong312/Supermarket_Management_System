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

};

export default OrderService;