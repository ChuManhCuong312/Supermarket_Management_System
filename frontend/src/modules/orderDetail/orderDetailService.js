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

   // Get order details with order information (to check deletedType)
    getAllWithOrderInfo: async () => {
      try {
        const [orderDetailsRes, ordersRes] = await Promise.all([
          axiosClient.get(`${API_BASE}`),
          axiosClient.get("/orders")
        ]);

        const orderDetails = orderDetailsRes.data;
        const orders = ordersRes.data;

        // Create a map of orderId -> order for quick lookup
        const orderMap = new Map(orders.map(order => [order.orderId, order]));

        // Enrich order details with order info
        return orderDetails.map(detail => ({
          ...detail,
          orderInfo: orderMap.get(detail.orderId),
          isOrderActive: orderMap.get(detail.orderId)?.deletedType === null ||
                         orderMap.get(detail.orderId)?.deletedType === undefined
        }));
      } catch (error) {
        console.error("Failed to fetch order details with order info:", error);
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

   createOrderDetail: async (orderDetail) => {
       try {
         const response = await axiosClient.post(`${API_BASE}/add`, orderDetail);
         return response.data;
       } catch (error) {
         console.error("Failed to create order detail:", error);
         // Extract error message from backend response
         const errorMsg = error?.response?.data || error.message;
         throw new Error(errorMsg);
       }
     },

  updateOrderDetail: async (id, updatedDetail) => {
      try {
        // Validate that the order is active before updating
        const orderRes = await axiosClient.get(`/orders/active/${updatedDetail.orderId}`);
        if (!orderRes.data || (orderRes.data.deletedType !== null && orderRes.data.deletedType !== undefined)) {
          throw new Error("Không thể cập nhật chi tiết của đơn hàng đã bị hủy hoặc ẩn!");
        }

        const response = await axiosClient.put(`${API_BASE}/update/${id}`, updatedDetail);
        return response.data;
      } catch (error) {
        console.error("Failed to update order detail:", error);
        throw error;
      }
    },

   // Get paginated order details
     getOrderDetailsByPage: async (page = 0, size = 10) => {
       try {
         const response = await axiosClient.get(`${API_BASE}/page?page=${page}&size=${size}`);
         return response.data;
       } catch (error) {
         console.error("Failed to get paginated order details:", error);
         throw error;
       }
     },

     // Get paginated order details with order info
       getOrderDetailsByPageWithOrderInfo: async (page = 0, size = 10) => {
         try {
           const [detailsRes, ordersRes] = await Promise.all([
             axiosClient.get(`${API_BASE}/page?page=${page}&size=${size}`),
             axiosClient.get("/orders")
           ]);

           const orderMap = new Map(ordersRes.data.map(order => [order.orderId, order]));

           const enrichedContent = detailsRes.data.content.map(detail => ({
             ...detail,
             orderInfo: orderMap.get(detail.orderId),
             isOrderActive: orderMap.get(detail.orderId)?.deletedType === null ||
                            orderMap.get(detail.orderId)?.deletedType === undefined
           }));

           return {
             ...detailsRes.data,
             content: enrichedContent
           };
         } catch (error) {
           console.error("Failed to get paginated order details with order info:", error);
           throw error;
         }
       },

     // Search order with paginated order details
     searchOrderDetailsByPage: async (orderId, productId, page = 0, size = 10) => {
       try {
         const params = {};
         if (orderId) params.orderId = orderId;
         if (productId) params.productId = productId;
         params.page = page;
         params.size = size;

         const response = await axiosClient.get(`${API_BASE}/search/page`, { params });
         return response.data;
       } catch (error) {
         console.error("Failed to search paginated order details:", error);
         throw error;
       }
     },
};

export default OrderDetailService;