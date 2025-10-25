import axiosClient from "../../api/axiosClient";

const productService = {
  // 🔹 Lấy danh sách sản phẩm (paging + sort)
  getAllProducts: async (page = 1, size = 10, sort = "none", sortBy = "name") => {
    const res = await axiosClient.get("/products", {
      params: { page, size, sort, sortBy },
    });
    return {
      data: res.data.data,
      totalPages: res.data.totalPages,
      totalItems: res.data.totalItems,
      currentPage: res.data.currentPage,
    };
  },

  // 🔹 Lấy 1 sản phẩm theo ID
  getProductById: async (id) => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  },

  // 🔹 Tạo mới sản phẩm
  createProduct: async (productRequest) => {
    const res = await axiosClient.post("/products", productRequest);
    return res.data;
  },

  // 🔹 Cập nhật sản phẩm
  updateProduct: async (id, productRequest) => {
    const res = await axiosClient.put(`/products/${id}`, productRequest);
    return res.data;
  },

  // 🔹 Xóa sản phẩm
  deleteProduct: async (id) => {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },

  // 🔹 Tìm kiếm sản phẩm (paging + sort)
  searchProducts: async (params = {}, page = 1, size = 10, sort = "none", sortBy = "name") => {
    const res = await axiosClient.get("/products/search", {
      params: {
        ...params, // có thể bao gồm: name, barcode, category, supplier
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

export default productService;
