import React, { useEffect, useState } from "react";
import employeeService from "./employeeService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css"; // dùng CSS chung


export default function EmployeeList() {
 const [employees, setEmployees] = useState([]);
 const [filters, setFilters] = useState({
   name: "",
   position: "",
   phone: "",
   email: "",
 });
 const [page, setPage] = useState(1);
 const itemsPerPage = 10;
 const startIndex = (page - 1) * itemsPerPage;
 const endIndex = startIndex + itemsPerPage;
 const currentEmployees = employees.slice(startIndex, endIndex);
 const navigate = useNavigate();


 const fetchEmployees = async () => {
   try {
     const data = await employeeService.getAllEmployees();
     setEmployees(data);
   } catch (err) {
     console.error("Lỗi khi tải nhân viên:", err);
   }
 };


 const handleSearch = async () => {
   const validParams = Object.fromEntries(
     Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
   );
   try {
     const data = await employeeService.searchEmployees(validParams);
     setEmployees(data);
     setPage(1);
   } catch (err) {
     console.error("Lỗi khi tìm kiếm:", err);
   }
 };


 const handleDelete = async (id) => {
   if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
     try {
       await employeeService.deleteEmployee(id);
       fetchEmployees();
     } catch (err) {
       console.error("Lỗi khi xóa:", err);
     }
   }
 };


 useEffect(() => {
   fetchEmployees();
 }, []);


 return (
   <div className="page">
     <div className="header">
       <span className="header-icon">👨‍💼</span>
       <h2 className="header-title">Quản lý nhân viên</h2>
       <button onClick={() => navigate("/")} className="back-btn">← Trở về</button>
     </div>


     <div className="filter">
       <div className="filter-grid">
         <input placeholder="Tên nhân viên" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} />
         <input placeholder="Chức vụ" value={filters.position} onChange={e => setFilters({ ...filters, position: e.target.value })} />
         <input placeholder="SĐT" value={filters.phone} onChange={e => setFilters({ ...filters, phone: e.target.value })} />
         <input placeholder="Email" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} />
       </div>
       <div className="filter-buttons">
         <button onClick={handleSearch} className="btn search-btn">🔍 Tìm kiếm</button>
         <button onClick={() => navigate("/employee/add")} className="btn add-btn">➕ Thêm mới</button>
       </div>
     </div>


     <div className="table-container">
       <table className="table">
         <thead>
           <tr>
             <th>ID</th>
             <th>Tên</th>
             <th>Chức vụ</th>
             <th>SĐT</th>
             <th>Email</th>
             <th>Lương</th>
             <th>Ca làm việc</th>
             <th>Thao tác</th>
           </tr>
         </thead>
         <tbody>
           {currentEmployees.length > 0 ? currentEmployees.map(e => (
             <tr key={e.id}>
               <td>{e.id}</td>
               <td>{e.name}</td>
               <td>{e.position}</td>
               <td>{e.phone}</td>
               <td>{e.email}</td>
               <td>{e.salary}</td>
               <td>{e.shift}</td>
               <td>
                 <div className="action-buttons">
                   <button onClick={() => navigate(`/employee/edit/${e.id}`)} className="edit-btn">✏️</button>
                   <button onClick={() => handleDelete(e.id)} className="delete-btn">🗑️</button>
                 </div>
               </td>
             </tr>
           )) : (
             <tr>
               <td colSpan="8" className="no-data">Không có dữ liệu nhân viên</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>


     <div className="pagination">
       <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>← Trước</button>
       <span>Trang {page} / {Math.ceil(employees.length / itemsPerPage)}</span>
       <button onClick={() => setPage(p => p < Math.ceil(employees.length / itemsPerPage) ? p + 1 : p)} disabled={page === Math.ceil(employees.length / itemsPerPage)}>Sau →</button>
     </div>
   </div>
 );
}
