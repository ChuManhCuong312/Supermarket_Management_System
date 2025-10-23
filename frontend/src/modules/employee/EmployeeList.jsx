import React, { useEffect, useState } from "react";
import employeeService from "./employeeService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
  });
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    salary: "",
    shift: "",
  });

const [sortConfig, setSortConfig] = useState({
    sort: "none",
    sortBy: "name"
  });

  const [showAddBox, setShowAddBox] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, employeeId: null, message: "" });
const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });

  const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
  const handleNewChange = (key, value) => setNewEmployee({ ...newEmployee, [key]: value });

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAllEmployees(page, itemsPerPage);
      setEmployees(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
    if (err?.isExtensionError) return;
    console.error("Lỗi khi tải nhân viên:", err);    }
  };

const handleSearch = async (searchFilters, sort = "none", sortBy = "name") => {
  const validParams = Object.fromEntries(
    Object.entries(searchFilters).filter(([_, v]) => v && v.trim() !== "")
  );

  try {
    if (Object.keys(validParams).length === 0) {
      const response = await employeeService.getAllEmployees(page, itemsPerPage, sort, sortBy);
      setEmployees(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      return;
    }

    const response = await employeeService.searchEmployees(validParams, page, itemsPerPage, sort, sortBy);
    setEmployees(response.data);
    setTotalPages(response.totalPages);
    setTotalItems(response.totalItems);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
  }
};


const handleSort = (field) => {
  setSortConfig(prev => {
    let newSort = {};
    if (prev.sortBy !== field || prev.sort === "none") {
      newSort = { sort: "asc", sortBy: field };
    } else if (prev.sort === "asc") {
      newSort = { sort: "desc", sortBy: field };
    } else {
      newSort = { sort: "none", sortBy: field };
    }
    handleSearch(filters, newSort.sort, newSort.sortBy);
    setPage(0);

    return newSort;
  });
};

const renderSortIcon = (field) => {
  if (sortConfig.sortBy !== field) return <span className="sort-icon none" />;

  if (sortConfig.sort === "asc") return <span className="sort-icon asc active" />;
  if (sortConfig.sort === "desc") return <span className="sort-icon desc active" />;

  return <span className="sort-icon none" />;
};

const openEditForm = (employee) => {
  setIsEditing(true);
  setEditingId(employee.id);
  setNewEmployee({
    name: employee.name,
    position: employee.position,
    phone: employee.phone,
    email: employee.email,
    salary: employee.salary,
    shift: employee.shift,
  });
  setShowAddBox(true);
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
        await employeeService.updateEmployee(editingId, formData);
        showModal("✓ Thành công", "Cập nhật nhân viên thành công!", "success");
      } else {
        await employeeService.createEmployee(formData);
        showModal("✓ Thành công", "Thêm mới nhân viên thành công!", "success");
      }
      closeForm();
      fetchEmployees();
    } catch (err) {
     let errorMsg = "Có lỗi xảy ra";
     if (err.response?.data) {
         errorMsg = typeof err.response.data === 'string'? err.response.data
         : err.response.data.message || JSON.stringify(err.response.data);
         } else if (err.message) {
             errorMsg = err.message;
             }
         showModal("❌ Lỗi", errorMsg, "error");
         }
  };

const handleSaveEmployee = async (e) => {
  e.preventDefault();
  try {
    if (isEditing) {
      // --- Cập nhật nhân viên ---
      await employeeService.updateEmployee(editingId, newEmployee);
      showModal("✓ Thành công", "Cập nhật nhân viên thành công!", "success");
    } else {
      // --- Thêm nhân viên mới ---
      await employeeService.createEmployee(newEmployee);
      showModal("✓ Thành công", "Thêm nhân viên mới thành công!", "success");
    }

    setShowAddBox(false);
    setIsEditing(false);
    setEditingId(null);
    setNewEmployee({ name: "", position: "", phone: "", email: "", salary: "", shift: "" });
    fetchEmployees();

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

  const handleDelete = (id) => {
    const employee = employees.find(e => e.id === id);
    setConfirmDelete({
      isOpen: true,
      employeeId: id,
      message: `Bạn có chắc muốn xóa nhân viên "${employee.name}" không?`
    });
  };

  const confirmDeleteEmployee = async () => {
    try {
      await employeeService.deleteEmployee(confirmDelete.employeeId);
      setPage(0);
      fetchEmployees();
      showModal("✓ Thành công", "Xóa nhân viên thành công!", "success");
    } catch (err) {
    console.error("Lỗi khi xóa:", err);
    showModal("❌ Lỗi", "Không thể xóa khách hàng", "error");
    } finally {
      setConfirmDelete({ isOpen: false, employeeId: null, message: "" });
    }
  };

  const cancelDelete = () => setConfirmDelete({ isOpen: false, employeeId: null, message: "" });
  const handlePageChange = (newPage) => setPage(newPage);
  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
    setTimeout(() => setModal({ isOpen: false, title: "", message: "", type: "info" }), 2000);
  };
  const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  return (
     <>
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <span className="header-icon">‍👨‍💼</span>
            <h2 className="header-title">Quản lý nhân viên</h2>
          </div>

          <nav className="header-nav">
            <button onClick={() => navigate("/")} className="back-btn">
                 Trang chủ
            </button>
            <button onClick={() => navigate("/products")} className="nav-btn">
              📦 Sản phẩm
            </button>
            <button onClick={() => navigate("/employees")} className="nav-btn active">
              👨‍💼 Nhân viên
            </button>
            <button onClick={() => navigate("/inventory")} className="nav-btn">
              📥 Nhập kho
            </button>
            <button onClick={() => navigate("/customers")} className="nav-btn">
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
              placeholder="Tên nhân viên"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
            <input
              placeholder="SĐT"
              value={filters.position}
              onChange={(e) => handleFilterChange("phone", e.target.value)}
            />
            <input
              placeholder="Email"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
            />
            <select
              value={filters.position}
              onChange={(e) => handleFilterChange("position", e.target.value)}
            >
              <option value="">Tất cả loại</option>
              <option value="Bán hàng">Bán hàng</option>
              <option value="Bảo vệ">Bảo vệ</option>
              <option value="Quản lý">Quản lý</option>
              <option value="Thu ngân">Thu ngân</option>
              <option value="Kho">Kho</option>

            </select>
          </div>

          <div className="filter-buttons">
            <button onClick={() => handleSearch(filters)} className="btn search-btn">
              🔍 Tìm kiếm
            </button>
            <button onClick={() => setShowAddBox(true)} className="btn add-btn">
              ➕ Thêm mới
            </button>
          </div>
        </div>


      {/* Stats */}
      <div style={{ padding: "10px 20px", color: "#666", fontSize: "14px", background: "#f1f8e9" }}>
        Tổng số: <strong>{totalItems}</strong> nhân viên
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
<th
                      className="sortable-header"
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Tên {renderSortIcon("name")}
              </th>
              <th>Chức vụ</th>
              <th>SĐT</th>
              <th>Email</th>
<th
                      className="sortable-header"
                      onClick={() => handleSort("salary")}
                      style={{ cursor: "pointer" }}
                    >
                      Lương {renderSortIcon("salary")}
                    </th>
              <th>Ca làm việc</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? employees.map(e => (
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
                    <button onClick={() => openEditForm(e)} className="edit-btn">✏️</button>
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

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>← Trước</button>
        <span>Trang {page + 1} / {totalPages || 1}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || totalPages === 0}>Sau →</button>
      </div>

      {/* Form Modal - Add/Edit */}
      {showAddBox && (
        <div className="modal-overlay" onClick={() => setShowAddBox(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
                <h3>{isEditing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>
                <button className="close-btn" onClick={() => setShowAddBox(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveEmployee}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Tên nhân viên <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập tên nhân viên"
                    value={newEmployee.name}
                    onChange={e => handleNewChange("name", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Chức vụ <span className="required">*</span></label>
                  <select
                    required
                    value={newEmployee.position}
                    onChange={e => handleNewChange("position", e.target.value)}
                  >
                    <option value="">-- Chọn chức vụ --</option>
                    <option value="Thu ngân">Thu ngân</option>
                    <option value="Bán hàng">Bán hàng</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Kho">Kho</option>
                    <option value="Bảo vệ">Bảo vệ</option>
                  </select>

                </div>
                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập SĐT"
                    value={newEmployee.phone}
                    onChange={e => handleNewChange("phone", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    required
                    type="email"
                    placeholder="Nhập email"
                    value={newEmployee.email}
                    onChange={e => handleNewChange("email", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Lương <span className="required">*</span></label>
                  <input
                    type="number"
                    placeholder="Nhập lương"
                    value={newEmployee.salary}
                    onChange={e => handleNewChange("salary", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Ca làm việc <span className="required">*</span></label>
                  <select
                    required
                    value={newEmployee.shift}
                    onChange={e => handleNewChange("shift", e.target.value)}
                  >
                    <option value="">-- Chọn ca làm việc --</option>
                    <option value="Sáng">Ca sáng (7:00 - 11:00)</option>
                    <option value="Chiều">Ca chiều (13:00 - 17:00)</option>
                    <option value="Tối">Ca tối (18:00 - 22:00)</option>
                    <option value="Cả ngày">Cả ngày (7:00 - 22:00)</option>
                  </select>
                </div>

              </div>
              <div className="form-modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddBox(false)}>Hủy</button>
                  <button type="submit" className="btn-save">
                    {isEditing ? "Cập nhật" : "Lưu"}
                  </button>
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

      {/* Delete Confirmation */}
      {confirmDelete.isOpen && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content modal-warning" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Xác nhận</h3>
            <p className="modal-message">{confirmDelete.message}</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>Hủy</button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteEmployee}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
);
}



