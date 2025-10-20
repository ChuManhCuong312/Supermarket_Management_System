import React, { useState, useEffect } from "react";
import customerService from "./customerService";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Customer-Employee.css";

export default function CustomerForm() {
 const [customer, setCustomer] = useState({
   name: "",
   phone: "",
   email: "",
   address: "",
   membershipType: "Thường",
   points: 0,
 });


 const [modal, setModal] = useState({
   isOpen: false,
   title: "",
   message: "",
   type: "info"
 });


 const { id } = useParams();
 const navigate = useNavigate();


 useEffect(() => {
   if (id) fetchCustomer();
 }, [id]);


 const fetchCustomer = async () => {
   try {
     const customers = await customerService.getAllCustomers();
     const found = customers.find((c) => c.id === parseInt(id));
     if (found) setCustomer(found);
   } catch (err) {
     console.error("Lỗi khi tải khách hàng:", err);
   }
 };


 const showModal = (title, message, type = "info", callback = null) => {
   setModal({ isOpen: true, title, message, type });
   if (callback && type !== "confirm") {
     setTimeout(() => {
       setModal({ isOpen: false });
       callback();
     }, 1500);
   }
 };


 const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });


 const handleSubmit = async () => {
   try {
     if (id) {
       await customerService.updateCustomer(id, customer);
       showModal("✓ Thành công", "Cập nhật khách hàng thành công!", "success",
         () => navigate("/customers")
       );
     } else {
       await customerService.createCustomer(customer);
       showModal("✓ Thành công", "Thêm mới khách hàng thành công!", "success",
         () => navigate("/customers")
       );
     }
   } catch (err) {
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
     {/* Header */}
     <div className="header">
       <span className="header-icon">👥</span>
       <h2 className="header-title">Quản lý khách hàng</h2>
       <button onClick={() => navigate("/customers")} className="back-btn">← Trở về</button>
     </div>


     {/* Form */}
     <div className="form-body">
       <div className="form-grid">
         <div>
           <label>Tên</label>
           <input
             placeholder="Tên"
             value={customer.name}
             onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
           />
         </div>
         <div>
           <label>SĐT</label>
           <input
             placeholder="SĐT"
             value={customer.phone}
             onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
           />
         </div>
         <div>
           <label>Email</label>
           <input
             placeholder="Email"
             value={customer.email}
             onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
           />
         </div>
         <div>
           <label>Địa chỉ</label>
           <input
             placeholder="Địa chỉ"
             value={customer.address}
             onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
           />
         </div>
         <div>
           <label>Loại TV</label>
           <select
             value={customer.membershipType}
             onChange={(e) => setCustomer({ ...customer, membershipType: e.target.value })}
           >
             <option value="Thường">Thường</option>
             <option value="VIP">VIP</option>
             <option value="Thân thiết">Thân thiết</option>
           </select>
         </div>
         <div>
           <label>Điểm tích lũy</label>
           <input
             type="number"
             placeholder="Điểm tích lũy"
             value={customer.points}
             onChange={(e) => setCustomer({ ...customer, points: e.target.value })}
           />
         </div>
       </div>


       <div className="form-actions">
         <button onClick={handleSubmit} className="save-btn">{id ? "Cập nhật" : "Lưu"}</button>
       </div>
     </div>


     {/* Modal */}
     {modal.isOpen && (
       <div className="modal-overlay" onClick={closeModal}>
         <div className={`modal-content modal-${modal.type}`} onClick={(e) => e.stopPropagation()}>
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
