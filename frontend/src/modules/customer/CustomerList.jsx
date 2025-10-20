import React, { useEffect, useState } from "react";
import customerService from "./customerService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css";

export default function CustomerList() {
 const [customers, setCustomers] = useState([]);
 const [filters, setFilters] = useState({
   name: "",
   phone: "",
   email: "",
   membershipType: "",
 });
 const [page, setPage] = useState(1);
 const itemsPerPage = 10;
 const startIndex = (page - 1) * itemsPerPage;
 const endIndex = startIndex + itemsPerPage;
 const currentCustomers = customers.slice(startIndex, endIndex);
 const navigate = useNavigate();


 const fetchCustomers = async () => {
   try {
     const data = await customerService.getAllCustomers();
     setCustomers(data);
   } catch (err) {
     console.error("Lỗi khi tải khách hàng:", err);
   }
 };


 const handleSearch = async () => {
   const validParams = Object.fromEntries(
     Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
   );
   try {
     const data = await customerService.searchCustomers(validParams);
     setCustomers(data);
     setPage(1);
   } catch (err) {
     console.error("Lỗi khi tìm kiếm:", err);
   }
 };


 const handleDelete = async (id) => {
   if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
     try {
       await customerService.deleteCustomer(id);
       fetchCustomers();
     } catch (err) {
       console.error("Lỗi khi xóa:", err);
     }
   }
 };


 useEffect(() => {
   fetchCustomers();
 }, []);


 return (
   <div className="page">
     {/* Header */}
     <div className="header">
       <span className="header-icon">👥</span>
       <h2 className="header-title">Quản lý khách hàng</h2>
       <button onClick={() => navigate("/")} className="back-btn">← Trở về</button>
     </div>


     {/* Filter */}
     <div className="filter">
       <div className="filter-grid">
         <input placeholder="Tên khách hàng" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })}/>
         <input placeholder="SĐT" value={filters.phone} onChange={(e) => setFilters({ ...filters, phone: e.target.value })}/>
         <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })}/>
         <select value={filters.membershipType} onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}>
           <option value="">Tất cả loại</option>
           <option value="Thường">Thường</option>
           <option value="VIP">VIP</option>
           <option value="Thân thiết">Thân thiết</option>
         </select>
       </div>
       <div className="filter-buttons">
         <button onClick={handleSearch} className="btn search-btn">🔍 Tìm kiếm</button>
         <button onClick={() => navigate("/customer/add")} className="btn add-btn">➕ Thêm mới</button>
       </div>
     </div>


     {/* Table */}
     <div className="table-container">
       <table className="table">
         <thead>
           <tr>
             <th>ID</th><th>Tên</th><th>SĐT</th><th>Email</th><th>Địa chỉ</th><th>Điểm</th><th>Loại TV</th><th>Thao tác</th>
           </tr>
         </thead>
         <tbody>
           {currentCustomers.length > 0 ? currentCustomers.map((c) => (
             <tr key={c.id}>
               <td>{c.id}</td><td>{c.name}</td><td>{c.phone}</td><td>{c.email}</td>
               <td>{c.address}</td><td>{c.points}</td><td>{c.membershipType}</td>
               <td>
                 <div className="action-buttons">
                   <button onClick={() => navigate(`/customer/edit/${c.id}`)} className="edit-btn">✏️</button>
                   <button onClick={() => handleDelete(c.id)} className="delete-btn">🗑️</button>
                 </div>
               </td>
             </tr>
           )) : (
             <tr><td colSpan="8" className="no-data">Không có dữ liệu khách hàng</td></tr>
           )}
         </tbody>
       </table>
     </div>


     {/* Pagination */}
     <div className="pagination">
       <button onClick={() => setPage(p => Math.max(p-1, 1))} disabled={page===1}>← Trước</button>
       <span>Trang {page} / {Math.ceil(customers.length / itemsPerPage)}</span>
       <button onClick={() => setPage(p => p < Math.ceil(customers.length / itemsPerPage) ? p+1 : p)} disabled={page===Math.ceil(customers.length / itemsPerPage)}>Sau →</button>
     </div>
   </div>
 );
}
