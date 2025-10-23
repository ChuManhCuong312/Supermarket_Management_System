import axiosClient from "../../api/axiosClient";

const supplierService = {
  // 🔹 Lấy danh sách nhà cung cấp
  getAllSuppliers: async (page = 1, size = 10, sort = "none", sortBy = "companyName") => {
    const res = await axiosClient.get("/suppliers", {
      params: { page, size, sort, sortBy },
    });
    return {
      data: res.data.data,
      totalPages: res.data.totalPages,
      totalItems: res.data.totalItems,
      currentPage: res.data.currentPage,
    };
  },

  // 🔹 Tạo mới nhà cung cấp
  createSupplier: async (supplier) => {
    try {
      const res = await axiosClient.post("/suppliers", supplier);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // 🔹 Cập nhật thông tin nhà cung cấp
  updateSupplier: async (id, supplier) => {
    try {
      const res = await axiosClient.put(`/suppliers/${id}`, supplier);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // 🔹 Xóa nhà cung cấp
  deleteSupplier: async (id) => {
    try {
      const res = await axiosClient.delete(`/suppliers/${id}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  // 🔹 Tìm kiếm nhà cung cấp
  searchSuppliers: async (params, page = 1, size = 10, sort = "none", sortBy = "companyName") => {
    const res = await axiosClient.get("/suppliers/search", {
      params: {
        ...params,
        page,
        size,
        sort,
        sortBy,
      },
    });
    return {
      data: res.data.data,
      totalPages: res.data.totalPages,
      totalItems: res.data.totalItems,
      currentPage: res.data.currentPage,
    };
  },
};

export default supplierService;
