import React, { useEffect, useState } from "react";
import supplierService from "./supplierService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [sortConfig, setSortConfig] = useState({
    sort: "none",
    sortBy: "name",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    contactPerson: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    supplierId: null,
    message: "",
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

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getAllSuppliers(
        page + 1,
        itemsPerPage,
        sortConfig.sort,
        sortConfig.sortBy
      );
      setSuppliers(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error("Lỗi khi tải nhà cung cấp:", err);
    }
  };

  const handleSearch = async (searchFilters) => {
    const validParams = Object.fromEntries(
      Object.entries(searchFilters).filter(([_, v]) => v && v.trim() !== "")
    );

    try {
      if (Object.keys(validParams).length === 0) {
        fetchSuppliers();
        return;
      }

      const response = await supplierService.searchSuppliers(
        validParams,
        1,
        itemsPerPage,
        sortConfig.sort,
        sortConfig.sortBy
      );
      setSuppliers(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setPage(0);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.sortBy !== field) {
        return { sort: "asc", sortBy: field };
      }
      if (prev.sort === "none") return { sort: "asc", sortBy: field };
      if (prev.sort === "asc") return { sort: "desc", sortBy: field };
      return { sort: "none", sortBy: field };
    });
    setPage(0);
  };

  const renderSortIcon = (field) => {
    if (sortConfig.sortBy !== field) return <span className="sort-icon none" />;
    if (sortConfig.sort === "asc")
      return <span className="sort-icon asc active" />;
    if (sortConfig.sort === "desc")
      return <span className="sort-icon desc active" />;
    return <span className="sort-icon none" />;
  };

  const handleDelete = (id) => {
    const supplier = suppliers.find((s) => s.supplierId === id);
    setConfirmDelete({
      isOpen: true,
      supplierId: id,
      message: `Bạn có chắc muốn xóa nhà cung cấp "${supplier.companyName}" không?`,
    });
  };

  const confirmDeleteSupplier = async () => {
    try {
      await supplierService.deleteSupplier(confirmDelete.supplierId);
      setPage(0);
      fetchSuppliers();
      showModal("✓ Thành công", "Xóa nhà cung cấp thành công!", "success");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showModal("❌ Lỗi", "Không thể xóa nhà cung cấp", "error");
    } finally {
      setConfirmDelete({ isOpen: false, supplierId: null, message: "" });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, supplierId: null, message: "" });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({
      companyName: "",
      phone: "",
      email: "",
      address: "",
      contactPerson: "",
    });
    setIsFormOpen(true);
  };

  const openEditForm = (supplier) => {
    setEditingId(supplier.supplierId);
    setFormData({
      companyName: supplier.companyName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supplierService.updateSupplier(editingId, formData);
        showModal("✓ Thành công", "Cập nhật nhà cung cấp thành công!", "success");
      } else {
        await supplierService.createSupplier(formData);
        showModal("✓ Thành công", "Thêm mới nhà cung cấp thành công!", "success");
      }
      closeForm();
      fetchSuppliers();
    } catch (err) {
      let errorMsg = "Có lỗi xảy ra";
      if (err.response?.data) {
        errorMsg =
          typeof err.response.data === "string"
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

  const closeModal = () =>
    setModal({ isOpen: false, title: "", message: "", type: "info" });

  useEffect(() => {
    fetchSuppliers();
  }, [page, sortConfig]);

  return (
    <div className="page" style={{padding:"0px"}}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <span className="header-icon">🏢</span>
          <h2 className="header-title">Quản lý nhà cung cấp</h2>
        </div>
      </div>

{/* Filter */}
<div className="content">
  <div className="search-section">
    <div className="search-group">
      <label>
        <span className="supplier-icon" /> Tên nhà cung cấp
      </label>
      <input
        type="text"
        placeholder="Nhập tên nhà cung cấp..."
        value={filters.name}
        onChange={(e) => handleFilterChange("name", e.target.value)}
      />
      <span
        className="clear-filter"
        onClick={() => {
          setFilters({ name: "", phone: "", email: "" });
          handleSearch({});
        }}
      >
        ✖ Clear Filter
      </span>
    </div>

    <div className="search-group">
      <label>
        <span className="phone-icon" /> Số điện thoại
      </label>
      <input
        type="text"
        placeholder="Nhập số điện thoại..."
        value={filters.phone}
        onChange={(e) => handleFilterChange("phone", e.target.value)}
      />
    </div>

    <div className="search-group">
      <label>
        <span className="email-icon" /> Email
      </label>
      <input
        type="text"
        placeholder="Nhập email..."
        value={filters.email}
        onChange={(e) => handleFilterChange("email", e.target.value)}
      />
    </div>
  </div>

  <div className="button-group" style={{ marginBottom: "0px" }}>
    <button onClick={() => handleSearch(filters)} className="search-btn">
      🔍 Tìm kiếm
    </button>
    <button onClick={openAddForm} className="add-btn">
      ➕ Thêm mới
    </button>
  </div>
</div>
  {/* Stats */}
  <div style={{ padding: "10px 20px", color: "#666", fontSize: "14px", background: "#f1f8e9" }}>
    Tổng số: <strong>{totalItems}</strong> nhà cung cấp
  </div>


{/*       Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th
                className="sortable-header"
                onClick={() => handleSort("companyName")}
                style={{ cursor: "pointer" }}
              >
                Tên {renderSortIcon("name")}
              </th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Người liên hệ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map((s) => (
                <tr key={s.supplierId}>
                  <td>{s.supplierId}</td>
                  <td>{s.companyName}</td>
                  <td>{s.phone}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{s.contactPerson}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => openEditForm(s)} className="edit-btn">✏️</button>
                      <button onClick={() => handleDelete(s.supplierId)} className="delete-btn">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">Không có dữ liệu nhà cung cấp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          ← Trước
        </button>
        <span>
          Trang {page + 1} / {totalPages || 1}
        </span>
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
              <h3>{editingId ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}</h3>
              <button className="close-btn" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Tên nhà cung cấp <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập tên nhà cung cấp"
                    value={formData.companyName|| ""}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    required
                    placeholder="Nhập SĐT"
                    value={formData.phone|| ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email|| ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    placeholder="Nhập địa chỉ"
                    value={formData.address|| ""}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Người liên hệ</label>
                  <input
                    placeholder="Nhập tên người liên hệ"
                    value={formData.contactPerson|| ""}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-modal-footer">
                <button type="button" onClick={closeForm} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className={`modal-content modal-${modal.type}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">
              {modal.type === "success" && "✅"}
              {modal.type === "error" && "❌"}
              {modal.type === "warning" && "⚠️"}
            </div>
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-ok" onClick={closeModal}>
                Đóng
              </button>
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
              <button className="modal-btn modal-btn-cancel" onClick={cancelDelete}>
                Hủy
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteSupplier}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
