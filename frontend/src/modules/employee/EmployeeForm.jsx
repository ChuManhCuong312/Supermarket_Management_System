import React, { useState, useEffect } from "react";
import employeeService from "./employeeService";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Customer-Employee.css";


export default function EmployeeForm() {
 const [employee, setEmployee] = useState({
   name: "",
   position: "",
   phone: "",
   email: "",
   salary: 0,
   shift: "",
 });


 const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });


 const { id } = useParams();
 const navigate = useNavigate();


 useEffect(() => {
   if (id) fetchEmployee();
 }, [id]);


 const fetchEmployee = async () => {
   try {
     const employees = await employeeService.getAllEmployees();
     const found = employees.find(e => e.id === parseInt(id));
     if (found) setEmployee(found);
   } catch (err) {
     console.error("Lỗi khi tải nhân viên:", err);
   }
 };


 const showModal = (title, message, type = "info", callback = null) => {
   setModal({ isOpen: true, title, message, type });
   if (callback && type !== "confirm") {
     setTimeout(() => { setModal({ isOpen: false }); callback(); }, 1500);
   }
 };


 const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });


 const handleSubmit = async () => {
   try {
     if (id) {
       await employeeService.updateEmployee(id, employee);
       showModal("✓ Thành công", "Cập nhật nhân viên thành công!", "success", () => navigate("/employee"));
     } else {
       await employeeService.createEmployee(employee);
       showModal("✓ Thành công", "Thêm mới nhân viên thành công!", "success", () => navigate("/employee"));
     }
   }  catch (err) {
     let errorMsg = "Có lỗi xảy ra";
     if (err.response?.data) {
       errorMsg = typeof err.response.data === 'string'
         ? err.response.data
         : err.response.data.message || JSON.stringify(err.response.data);
     } else if (err.message) {
       errorMsg = err.message;
     }
     showModal("❌ Lỗi", errorMsg, "error");
   }
 };




 return (
   <div className="page">
     <div className="header">
       <span className="header-icon">👨‍💼</span>
       <h2 className="header-title">Quản lý nhân viên</h2>
       <button onClick={() => navigate("/employee")} className="back-btn">← Trở về</button>
     </div>


     <div className="form-body">
       <div className="form-grid">
         <div>
           <label>Tên</label>
           <input placeholder="Tên" value={employee.name} onChange={e => setEmployee({ ...employee, name: e.target.value })} />
         </div>
         <div>
           <label>Chức vụ</label>
           <input placeholder="Chức vụ" value={employee.position} onChange={e => setEmployee({ ...employee, position: e.target.value })} />
         </div>
         <div>
           <label>SĐT</label>
           <input placeholder="SĐT" value={employee.phone} onChange={e => setEmployee({ ...employee, phone: e.target.value })} />
         </div>
         <div>
           <label>Email</label>
           <input placeholder="Email" value={employee.email} onChange={e => setEmployee({ ...employee, email: e.target.value })} />
         </div>
         <div>
           <label>Lương</label>
           <input type="number" placeholder="Lương" value={employee.salary} onChange={e => setEmployee({ ...employee, salary: e.target.value })} />
         </div>
         <div>
           <label>Ca làm việc</label>
           <input placeholder="Ca làm việc" value={employee.shift} onChange={e => setEmployee({ ...employee, shift: e.target.value })} />
         </div>
       </div>


       <div className="form-actions">
         <button onClick={handleSubmit} className="save-btn">{id ? "Cập nhật" : "Lưu"}</button>
       </div>
     </div>


     {modal.isOpen && (
       <div className="modal-overlay" onClick={closeModal}>
         <div className={`modal-content modal-${modal.type}`} onClick={e => e.stopPropagation()}>
           <div className="modal-icon">
             {modal.type === "success" && "✅"}
             {modal.type === "error" && "❌"}
             {modal.type === "warning" && "⚠️"}
           </div>
           <h3 className="modal-title">{modal.title}</h3>
           <p className="modal-message">{modal.message}</p>
           <div className="modal-buttons">
             <button className="modal-btn modal-btn-ok" onClick={closeModal}>Đóng</button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}
