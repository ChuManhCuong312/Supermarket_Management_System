import axiosClient from "../../api/axiosClient";

const employeeService = {
  getAllEmployees: async (page = 0, size = 10, sort = "none", sortBy = "name") => {
    const res = await axiosClient.get("/employees", {
      params: { page, size, sort, sortBy }
    });
    return {
      data: res.data.data,
      totalPages: res.data.totalPages,
      totalItems: res.data.totalItems,
      currentPage: res.data.currentPage
    };
  },

  createEmployee: async (employee) => {
    const res = await axiosClient.post("/employees", employee);
    return res.data;
  },

  updateEmployee: async (id, employee) => {
    const res = await axiosClient.put(`/employees/${id}`, employee);
    return res.data;
  },

  deleteEmployee: async (id) => {
    const res = await axiosClient.delete(`/employees/${id}`);
    return res.data;
  },

  searchEmployees: async (filters, page = 0, size = 10) => {
    const res = await axiosClient.get("/employees/search", {
      params: { ...filters, page, size }
    });
    return res.data;
  }
};

export default employeeService;
