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
    try{
    const res = await axiosClient.post("/employees", employee);
    return res.data;
        } catch (err) {
          throw err;
        }
  },

  updateEmployee: async (id, employee) => {
    try{
    const res = await axiosClient.put(`/employees/${id}`, employee);
    return res.data;
        } catch (err) {
          throw err;
        }
  },

  deleteEmployee: async (id) => {
    try{const res = await axiosClient.delete(`/employees/${id}`);
    return res.data;
        } catch (err) {
          throw err;
        }
  },

  searchEmployees: async (filters, page = 0, size = 10) => {
    try{
    const res = await axiosClient.get("/employees/search", {
      params: { ...filters, page, size }
    });
    return res.data;
     } catch (err) {
               throw err;
             }
  }
};

export default employeeService;


