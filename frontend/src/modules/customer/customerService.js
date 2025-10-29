import axiosClient from "../../api/axiosClient";

const customerService = {
   getAllCustomers: async (page = 1, size = 10, sort = "none", sortBy = "name") => {
       const res = await axiosClient.get('/customers', {
         params: { page, size, sort, sortBy }
       });
       return {
         data: res.data.data,
         totalPages: res.data.totalPages,
         totalItems: res.data.totalItems,
         currentPage: res.data.currentPage
       };
     },

  // Tạo khách hàng mới
  createCustomer: async (customer) => {
    try {
      const res = await axiosClient.post("/customers", customer);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // Cập nhật khách hàng
  updateCustomer: async (id, customer) => {
    try {
      const res = await axiosClient.put(`/customers/${id}`, customer);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // Xóa khách hàng
  deleteCustomer: async (id) => {
    try {
      const res = await axiosClient.delete(`/customers/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // Tìm kiếm khách hàng
searchCustomers: async (params, page = 1, size = 10, sort = "none", sortBy = "name") => {
  const res = await axiosClient.get('/customers/search', {
    params: {
      ...params,
      page,
      size,
      sort,
      sortBy
    }
  });
  return {
    data: res.data.data,
    totalPages: res.data.totalPages,
    totalItems: res.data.totalItems,
    currentPage: res.data.currentPage
  };
}
};

export default customerService;