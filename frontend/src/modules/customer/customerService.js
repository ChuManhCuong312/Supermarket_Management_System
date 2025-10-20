import axiosClient from "../../api/axiosClient";


const customerService = {
 // Lấy tất cả khách hàng
 getAllCustomers: async (sort = "none", sortBy = "name") => {
   try {
     const res = await axiosClient.get("/customers", {
       params: { sort, sortBy }
     });
     return res.data;
   } catch (err) {
     throw err;
   }
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
 searchCustomers: async (filters) => {
   try {
     const res = await axiosClient.get("/customers/search", {
       params: filters
     });
     return res.data;
   } catch (err) {
     throw err;
   }
 }
};


export default customerService;
