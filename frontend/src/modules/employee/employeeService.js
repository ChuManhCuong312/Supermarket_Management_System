import axiosClient from "../../api/axiosClient";

const employeeService = {
 // Lấy tất cả nhân viên
 getAllEmployees: async (sort = "none", sortBy = "name") => {
   try {
     const res = await axiosClient.get("/employees", {
       params: { sort, sortBy }
     });
     return res.data;
   } catch (err) {
     throw err;
   }
 },

 // Tạo nhân viên mới
 createEmployee: async (employee) => {
   try {
     const res = await axiosClient.post("/employees", employee);
     return res.data;
   } catch (err) {
     throw err;
   }
 },

 // Cập nhật nhân viên
 updateEmployee: async (id, employee) => {
   try {
     const res = await axiosClient.put(`/employees/${id}`, employee);
     return res.data;
   } catch (err) {
     throw err;
   }
 },

 // Xóa nhân viên
 deleteEmployee: async (id) => {
   try {
     const res = await axiosClient.delete(`/employees/${id}`);
     return res.data;
   } catch (err) {
     throw err;
   }
 },

 // Tìm kiếm nhân viên
 searchEmployees: async (filters) => {
   try {
     const res = await axiosClient.get("/employees/search", {
       params: filters
     });
     return res.data;
   } catch (err) {
     throw err;
   }
 }
};

export default employeeService;
