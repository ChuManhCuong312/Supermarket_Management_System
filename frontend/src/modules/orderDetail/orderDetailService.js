import axiosClient from "../../api/axiosClient";

const OrderDetailService = {
  getAll: async () => {
    try {
      const response = await axiosClient.get("/orderdetails"); // adjust API path if needed
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      return [];
    }
  },
};

export default OrderDetailService;
