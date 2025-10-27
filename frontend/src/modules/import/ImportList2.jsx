import React, { useEffect, useState } from "react";
import importService2 from "./importService2"; // giả sử bạn có service tương tự productService
import "../../styles/Customer-Employee.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ImportList() {
  const [imports, setImports] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    importDate: "",
    importDetails: [],
    totalAmount: 0,
    note: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    importId: null,
    message: "",
  });
  const [suggestions, setSuggestions] = useState({ index: null, list: [] });
  // ===== API calls =====
  const fetchImports = async () => {
    try {
      const response = await importService2.getAllImports(page + 1, itemsPerPage);
      setImports(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err) {
      console.error("Lỗi khi tải nhập kho:", err);
    }
  };

  const handleSearch = async (searchFilters) => {
    const { startDate, endDate } = searchFilters;

    // Nếu cả 2 chưa có giá trị, gọi fetchImports() để load tất cả
    if (!startDate && !endDate) {
      fetchImports();
      return;
    }

    // Nếu chỉ có 1 trong 2, không gọi API
    if (!startDate || !endDate) {
      return;
    }

    // Kiểm tra startDate phải <= endDate
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu phải trước Ngày kết thúc!");
      return;
    }

    try {
      const response = await importService2.searchImports({
        startDate,
        endDate,
        page: 1,
        size: itemsPerPage,
      });

      setImports(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setPage(0);
    } catch (err) {
      toast.error("Lỗi khi tìm kiếm!");
      console.error(err);
    }
  };

  const handleDelete = (importId) => {
    const imp = imports.find((i) => i.importId === importId);
    setConfirmDelete({
      isOpen: true,
      importId,
      message: imp
        ? `Bạn có chắc muốn xóa phiếu nhập #${imp.importId} không?`
        : "Bạn có chắc muốn xóa phiếu nhập này không?",
    });
  };

  const confirmDeleteImport = async () => {
    try {
      await importService2.deleteImport(confirmDelete.importId);
      setPage(0);
      fetchImports();
      showModal("✓ Thành công", "Xóa phiếu nhập thành công!", "success");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showModal("❌ Lỗi", "Không thể xóa phiếu nhập", "error");
    } finally {
      setConfirmDelete({ isOpen: false, importId: null, message: "" });
    }
  };

  const cancelDelete = () => setConfirmDelete({ isOpen: false, importId: null, message: "" });

  const handlePageChange = (newPage) => setPage(newPage);

  // ===== FORM =====
  const openAddForm = (imp) => {
    if (imp && imp.importId) {
      // 🟦 Chỉnh sửa
      setEditingId(imp.importId);

      fetch(`http://localhost:8080/api/imports2/${imp.importId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không thể tải chi tiết phiếu nhập");
          return res.json();
        })
        .then((data) => {
          setFormData({
            importId: data.importId,
            importDate: data.importDate,
            totalAmount: data.totalAmount,
            note: data.note || "",
            importDetails:
              data.importDetails?.map((d) => ({
                detailId: d.detailId,
                productId: d.productId,
                productName: d.productName,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                subtotal: d.subtotal
              })) || []
          });
          setIsFormOpen(true);
        })
        .catch((err) => {
          console.error("Lỗi tải chi tiết phiếu nhập:", err);
          toast.error("Không thể tải thông tin phiếu nhập!");
        });
      return;
    }

    // 🟩 Thêm mới
    setEditingId(null); // quan trọng: null để biết đây là add
    setFormData({
        importId: null,
      importDate: new Date().toISOString().split("T")[0],
      totalAmount: 0,
      note: "",
      importDetails: [
        {
          detailId: 0,
          productId: 0,
          productName: "",
          quantity: 0,
          unitPrice: 0,
          subtotal: 0
        }
      ]
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
        await importService2.updateImport(editingId, formData);
        showModal("✓ Thành công", "Cập nhật phiếu nhập thành công!", "success");
      } else {
        await importService2.createImport(formData);
        showModal("✓ Thành công", "Thêm mới phiếu nhập thành công!", "success");
      }
      closeForm();
      fetchImports();
    } catch (err) {
      console.error("❌ API Error:", err);
      let errorMsg =
        err.response?.data?.message || err.message || "Có lỗi xảy ra";
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

  // ===== Effects =====
  useEffect(() => {
    fetchImports();
  }, [page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  // ===== Render =====
  return (
    <div className="page" style={{ padding: "0px" }}>
      <div className="header">
        <div className="header-left">
          <span className="header-icon">📥</span>
          <h2 className="header-title">Quản lý nhập kho</h2>
        </div>
      </div>

      <div className="content">
        {/* Filter */}
        <div className="search-section">
          <div className="search-group">
            <label><span className="list-icon"></span>Ngày bắt đầu</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="search-group">
            <label><span className="list-icon"></span>Ngày kết thúc</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={() => setFilters({ startDate: "", endDate: "" })}
          style={{
            color: "#999",
            fontSize: "12px",
            cursor: "pointer",
            marginTop: "5px",
            display: "inline-block",
            background: "none",
            border: "none",
            padding: "0"
          }}
        >
          ✖ Clear Filter
        </button>
        <div className="button-group">
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
        Tổng số: <strong>{totalItems}</strong> phiếu nhập
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày nhập</th>
              <th>Chi tiết nhập</th>
              <th>Tổng tiền</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {imports.length > 0 ? (
              imports.map((imp) => (
                <tr key={imp.importId}>
                  <td>{imp.importId}</td>
                  <td>{imp.importDate}</td>
                  <td>
                    {imp.importDetails.map((d, i) => (
                      <div key={i}>
                        {d.quantity} x {d.productName}
                      </div>
                    ))}
                  </td>
                  <td>{imp.totalAmount.toLocaleString()}</td>
                  <td>{imp.note}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => openAddForm(imp)} className="edit-btn">✏️</button>
                      <button onClick={() => handleDelete(imp.importId)} className="delete-btn">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">Không có dữ liệu phiếu nhập</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>← Trước</button>
        <span>Trang {page + 1} / {totalPages || 1}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || totalPages === 0}>
          Sau →
        </button>
      </div>

      {isFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
          onClick={closeForm}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "90%",
              maxWidth: "900px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                backgroundColor: "var(--primary-color)",
                color: "#fff"
              }}
            >
              <h3 style={{ margin: 0 }}>
                {editingId != null ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}
              </h3>
              <button
                onClick={closeForm}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const totalAmount = formData.importDetails.reduce(
                  (sum, item) => sum + item.quantity * item.unitPrice,
                  0
                );

                const payload = {
                  importDate: formData.importDate,
                  note: formData.note,
                  totalAmount,
                  importDetails: formData.importDetails.map((item) => ({
                    detailId: item.detailId,
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.quantity * item.unitPrice
                  }))
                };

                // Nếu chỉnh sửa thì thêm importId vào payload
                if (editingId != null) {
                  payload.importId = editingId;
                }

                try {
                  const res = await fetch(
                    editingId
                      ? `http://localhost:8080/api/imports2/${editingId}` // PUT hoặc POST cập nhật
                      : "http://localhost:8080/api/imports2",            // POST thêm mới
                    {
                      method: editingId ? "PUT" : "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    }
                  );

                   if (!res.ok) {
                      // đọc message từ response
                      const errorText = await res.text();
                      throw new Error(errorText || "Lỗi khi lưu phiếu nhập");
                    }

                    toast.success("Lưu phiếu nhập thành công!");
                    closeForm();
                    fetchImports();
                  } catch (err) {
                    toast.error(err.message);
                    console.error(err);
                  }
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  maxHeight: "60vh",
                  overflowY: "auto"
                }}
              >
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontWeight: 600 }}>Ngày nhập <span style={{ color: "red" }}>*</span></label>
                  <input
                    type="date"
                    required
                    value={formData.importDate}
                    onChange={(e) => setFormData({ ...formData, importDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontWeight: 600 }}>Ghi chú</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      resize: "vertical"
                    }}
                  />
                </div>

                {/* Import Details Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}>
                      <th style={{ border: "1px solid #ddd", padding: "8px", display: "none" }}>Detail ID</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", display: "none" }}>Product ID</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sản phẩm</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Số lượng</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Đơn giá</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Thành tiền</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.importDetails.map((item, index) => (
                      <tr key={index} >
                        {/* Detail ID (ẩn đi) */}
                        <td style={{ border: "1px solid #ddd", padding: "8px", display: "none" }}>
                          {item.detailId || "-"}
                        </td>

                        {/* Product ID (ẩn đi) */}
                        <td style={{ border: "1px solid #ddd", padding: "8px", display: "none" }}>
                          {item.productId || "-"}
                        </td>

                        {/* Product Name */}
                        <td style={{ border: "1px solid #ddd", padding: "8px", position: "relative" }}>
                          <input
                            value={item.productName}
                            onChange={async (e) => {
                              const newDetails = [...formData.importDetails];
                              newDetails[index].productName = e.target.value;
                              setFormData({ ...formData, importDetails: newDetails });

                              if (e.target.value.trim()) {
                                const res = await fetch(
                                  `http://localhost:8080/api/products/namesearch?name=${encodeURIComponent(
                                    e.target.value
                                  )}`
                                );
                                const suggestions = await res.json();
                                setSuggestions({ index, list: suggestions });
                              } else {
                                setSuggestions({ index: null, list: [] });
                              }
                            }}
                            onFocus={async (e) => {
                              if (e.target.value.trim()) {
                                const res = await fetch(
                                  `http://localhost:8080/api/products/namesearch?name=${encodeURIComponent(
                                    e.target.value
                                  )}`
                                );
                                const suggestions = await res.json();
                                setSuggestions({ index, list: suggestions });
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "4px 6px",
                              border: "none",
                              outline: "none",
                              background: "transparent"
                            }}
                          />

                          {/* Autocomplete */}
                          {suggestions.index === index && suggestions.list.length > 0 && (
                            <ul
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                background: "#fff",
                                border: "1px solid #ccc",
                                zIndex: 10,
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                maxHeight: "150px",
                                overflowY: "auto"
                              }}
                            >
                              {suggestions.list.map((s, i) => (
                                <li
                                  key={i}
                                  onClick={() => {
                                    const newDetails = [...formData.importDetails];
                                    newDetails[index].productName = s.name;
                                    newDetails[index].productId = s.productId;
                                    setFormData({ ...formData, importDetails: newDetails });
                                    setSuggestions({ index: null, list: [] });
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    cursor: "pointer"
                                  }}
                                  onMouseEnter={(e) => (e.target.style.background = "#f1f1f1")}
                                  onMouseLeave={(e) => (e.target.style.background = "#fff")}
                                >
                                  {s.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>

                        {/* Quantity */}
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const newDetails = [...formData.importDetails];
                              newDetails[index].quantity = Math.max(0, Number(e.target.value));
                              setFormData({ ...formData, importDetails: newDetails });
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              textAlign: "right"
                            }}
                          />
                        </td>

                        {/* Unit Price */}
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newDetails = [...formData.importDetails];
                              newDetails[index].unitPrice = Math.max(0, Number(e.target.value));
                              setFormData({ ...formData, importDetails: newDetails });
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              textAlign: "right"
                            }}
                          />
                        </td>

                        {/* Subtotal */}
                        <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>
                          {(item.quantity * item.unitPrice).toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => {
                              const newDetails = formData.importDetails.filter((_, i) => i !== index);
                              setFormData({ ...formData, importDetails: newDetails });
                            }}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Tổng giá trị */}
                <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "1rem" }}>
                  Tổng cộng:{" "}
                  {formData.importDetails
                    .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                    .toLocaleString()}{" "}
                  đ
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      importDetails: [
                        ...formData.importDetails,
                        {
                          detailId: 0,
                          productId: 0,
                          productName: "",
                          quantity: 0,
                          unitPrice: 0,
                          subtotal: 0
                        }
                      ]
                    })
                  }
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  ➕ Thêm sản phẩm
                </button>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  padding: "12px 24px",
                  backgroundColor: "#f8f9fa",
                  borderTop: "1px solid #ddd"
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "rgb(40, 167, 69)",
                    color: "#fff",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
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
              <button className="modal-btn modal-btn-confirm" onClick={confirmDeleteImport}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}