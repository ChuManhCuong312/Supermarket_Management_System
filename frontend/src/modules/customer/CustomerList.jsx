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
const handleFilterChange = (key, value) => {
  setFilters({ ...filters, [key]: value });
};
useEffect(() => {
  const timeout = setTimeout(() => {
    handleSearch(filters);
  }, 300);

  return () => clearTimeout(timeout);
}, [filters]);


  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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
const [confirmDelete, setConfirmDelete] = useState({
  isOpen: false,
  customerId: null,
  message: ""
});


  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers(page + 1, itemsPerPage);
      setCustomers(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error("Lỗi khi tải khách hàng:", err);
    }
  };

const handleSearch = async (searchFilters) => {
  const validParams = Object.fromEntries(
    Object.entries(searchFilters).filter(([_, v]) => v && v.trim() !== "")
  );

  try {
    if (Object.keys(validParams).length === 0) {
      fetchCustomers();
      return;
    }

    const response = await customerService.searchCustomers(validParams, 1, itemsPerPage);
    setCustomers(response.data);
    setTotalPages(response.totalPages);
    setTotalItems(response.totalItems);
    setPage(0);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
  }
};


const handleDelete = (id) => {
  const customer = customers.find(c => c.id === id);
  setConfirmDelete({
    isOpen: true,
    customerId: id,
    message: `Bạn có chắc muốn xóa khách hàng "${customer.name}" không?`
  });
};

const confirmDeleteCustomer = async () => {
  try {
    await customerService.deleteCustomer(confirmDelete.customerId);
    setPage(0);
    fetchCustomers();
    showModal("✓ Thành công", "Xóa khách hàng thành công!", "success");
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
    showModal("❌ Lỗi", "Không thể xóa khách hàng", "error");
  } finally {
    setConfirmDelete({ isOpen: false, customerId: null, message: "" });
  }
};

const cancelDelete = () => {
  setConfirmDelete({ isOpen: false, customerId: null, message: "" });
};


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Mở form thêm mới
  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      membershipType: "Thường",
      points: 0,
    });
    setIsFormOpen(true);
  };

  // Mở form chỉnh sửa
  const openEditForm = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      membershipType: customer.membershipType,
      points: customer.points,
    });
    setIsFormOpen(true);
  };

  // Đóng form
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customerService.updateCustomer(editingId, formData);
        showModal("✓ Thành công", "Cập nhật khách hàng thành công!", "success");
      } else {
        await customerService.createCustomer(formData);
        showModal("✓ Thành công", "Thêm mới khách hàng thành công!", "success");
      }
      closeForm();
      fetchCustomers();
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

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
    setTimeout(() => {
      setModal({ isOpen: false, title: "", message: "", type: "info" });
    }, 2000);
  };

  const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  return (
      <>
    {/* Header */}
    <div className="header">
      <div className="header-left">
        <span className="header-icon">👥</span>
        <h2 className="header-title">Quản lý khách hàng</h2>
      </div>

      <nav className="header-nav">
        <button onClick={() => navigate("/")} className="back-btn">
             Trang chủ
        </button>
        <button onClick={() => navigate("/products")} className="nav-btn">
          📦 Sản phẩm
        </button>
        <button onClick={() => navigate("/employees")} className="nav-btn">
          👨‍💼 Nhân viên
        </button>
        <button onClick={() => navigate("/inventory")} className="nav-btn">
          📥 Nhập kho
        </button>
        <button onClick={() => navigate("/customers")} className="nav-btn active">
          👥 Khách hàng
        </button>
        <button onClick={() => navigate("/suppliers")} className="nav-btn">
          🏢 Nhà cung cấp
        </button>
        <button onClick={() => navigate("/orders")} className="nav-btn">
          🛒 Đơn hàng
        </button>
        <button onClick={() => navigate("/order-details")} className="nav-btn">
          📋 Chi tiết đơn hàng
        </button>
      </nav>
    </div>

      {/* Filter */}
      <div className="filter">
        <div className="filter-grid">
          <input
            placeholder="Tên khách hàng"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
          <input
            placeholder="SĐT"
            value={filters.phone}
            onChange={(e) => handleFilterChange("phone", e.target.value)}
          />
          <input
            placeholder="Email"
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}

                    />
          <select
            value={filters.membershipType}
            onChange={(e) => handleFilterChange("membershipType", e.target.value)}
          >
            <option value="">Tất cả loại</option>
            <option value="Thường">Thường</option>
            <option value="VIP">VIP</option>
            <option value="Thân thiết">Thân thiết</option>
          </select>
        </div>
        <div className="filter-buttons">
         <button onClick={() => handleSearch(filters)} className="btn search-btn">🔍 Tìm kiếm</button>
          <button onClick={openAddForm} className="btn add-btn">➕ Thêm mới</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "10px 20px", color: "#666", fontSize: "14px", background: "#f1f8e9" }}>
        Tổng số: <strong>{totalItems}</strong> khách hàng
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Điểm</th>
              <th>Loại TV</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td>{c.points}</td>
                <td>{c.membershipType}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => openEditForm(c)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(c.id)} className="delete-btn">🗑️</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="no-data">Không có dữ liệu khách hàng</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          ← Trước
        </button>
        <span>Trang {page + 1} / {totalPages || 1}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1 || totalPages === 0}
        >
          Sau →
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h3>{editingId ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</h3>
              <button className="close-btn" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Tên khách hàng <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập tên khách hàng"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập SĐT"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    required
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ<span className="required">*</span></label>
                  <input
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Loại thành viên</label>
                  <select
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                  >
                    <option value="Thường">Thường</option>
                    <option value="VIP">VIP</option>
                    <option value="Thân thiết">Thân thiết</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Điểm tích lũy</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-modal-footer">
                <button type="button" onClick={closeForm} className="btn-cancel">Hủy</button>
                <button type="submit" className="btn-save">{editingId ? "Cập nhật" : "Lưu"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Notification Modal */}
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
      {/* Delete Confirmation Modal */}
      {confirmDelete.isOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Xác nhận</h3>
            <p className="modal-message">{confirmDelete.message}</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>Hủy</button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteCustomer}>Xóa</button>
            </div>
          </div>
        </div>
      )}
   </>
  );
}