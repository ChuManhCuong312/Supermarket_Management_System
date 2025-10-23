import React, { useEffect, useState } from "react";
import importService from "./importService";
import { useNavigate } from "react-router-dom";
import "../../styles/Customer-Employee.css"; // dùng lại CSS của bạn

export default function ImportList() {
    const [imports, setImports] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
    });

    const [newImport, setNewImport] = useState({
        supplierId: "",
        importDate: "",
        totalAmount: "",
        status: "",
        note: "",
    });

    const [showAddBox, setShowAddBox] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });
    const navigate = useNavigate();

    // === Fetch Imports ===
    const fetchImports = async () => {
        try {
            const data = await importService.getAll(page, 10);
            setImports(data.imports);
            setTotalItems(data.totalItems);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhập kho:", err);
        }
    };

    useEffect(() => {
        fetchImports();
    }, [page]);

    // === Handlers ===
    const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
    const handleNewChange = (key, value) => setNewImport({ ...newImport, [key]: value });

    const handleSearchByDate = async () => {
        if (!filters.startDate || !filters.endDate) return;
        try {
            const result = await importService.filterByDate(filters.startDate, filters.endDate, "asc");
            setImports(result);
        } catch (err) {
            showModal("❌ Lỗi", "Không tìm thấy dữ liệu trong khoảng thời gian này", "error");
        }
    };

    const handleSearchByAmount = async () => {
        if (!filters.minAmount || !filters.maxAmount) return;
        try {
            const result = await importService.filterByAmount(filters.minAmount, filters.maxAmount, "asc");
            setImports(result);
        } catch (err) {
            showModal("❌ Lỗi", "Không tìm thấy dữ liệu theo giá trị", "error");
        }
    };

    const handleSaveImport = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await importService.update(editingId, newImport);
                showModal("✓ Thành công", "Cập nhật phiếu nhập thành công!", "success");
            } else {
                await importService.create(newImport);
                showModal("✓ Thành công", "Thêm mới phiếu nhập thành công!", "success");
            }
            setShowAddBox(false);
            setIsEditing(false);
            setNewImport({ supplierId: "", importDate: "", totalAmount: "", status: "", note: "" });
            fetchImports();
        } catch (err) {
            showModal("❌ Lỗi", "Không thể lưu phiếu nhập", "error");
        }
    };

    const handleEdit = (item) => {
        setIsEditing(true);
        setEditingId(item.id);
        setNewImport(item);
        setShowAddBox(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phiếu nhập này không?")) return;
        try {
            await importService.delete(id);
            showModal("✓ Thành công", "Xóa phiếu nhập thành công!", "success");
            fetchImports();
        } catch (err) {
            showModal("❌ Lỗi", "Không thể xóa phiếu nhập", "error");
        }
    };

    const handlePageChange = (newPage) => setPage(newPage);
    const showModal = (title, message, type = "info") => {
        setModal({ isOpen: true, title, message, type });
        setTimeout(() => setModal({ isOpen: false, title: "", message: "", type: "info" }), 2000);
    };
    const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });

    // === Render ===
    return (
        <>
            {/* Header */}
            <div className="header">
                <div className="header-left">
                    <span className="header-icon">📥</span>
                    <h2 className="header-title">Quản lý nhập kho</h2>
                </div>

                <nav className="header-nav">
                    <button onClick={() => navigate("/")} className="nav-btn">🏠 Trang chủ</button>
                    <button onClick={() => navigate("/employees")} className="nav-btn">👨‍💼 Nhân viên</button>
                    <button onClick={() => navigate("/inventory")} className="nav-btn active">📥 Nhập kho</button>
                    <button onClick={() => navigate("/suppliers")} className="nav-btn">🏢 Nhà cung cấp</button>
                </nav>
            </div>

            {/* Filter */}
            <div className="filter">
                <div className="filter-grid">
                    <label>Từ ngày</label>
                    <input type="date" value={filters.startDate} onChange={(e) => handleFilterChange("startDate", e.target.value)} />
                    <label>Đến ngày</label>
                    <input type="date" value={filters.endDate} onChange={(e) => handleFilterChange("endDate", e.target.value)} />
                    <button onClick={handleSearchByDate} className="btn search-btn">🔍 Lọc theo ngày</button>
                </div>

                <div className="filter-grid">
                    <label>Giá trị từ</label>
                    <input type="number" value={filters.minAmount} onChange={(e) => handleFilterChange("minAmount", e.target.value)} />
                    <label>Đến</label>
                    <input type="number" value={filters.maxAmount} onChange={(e) => handleFilterChange("maxAmount", e.target.value)} />
                    <button onClick={handleSearchByAmount} className="btn search-btn">🔍 Lọc theo giá trị</button>
                </div>

                <div className="filter-buttons">
                    <button onClick={() => setShowAddBox(true)} className="btn add-btn">➕ Thêm mới</button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nhà cung cấp</th>
                            <th>Ngày nhập</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imports.length > 0 ? imports.map(i => (
                            <tr key={i.id}>
                                <td>{i.id}</td>
                                <td>{i.supplierId}</td>
                                <td>{i.importDate}</td>
                                <td>{i.totalAmount}</td>
                                <td>{i.status}</td>
                                <td>{i.note}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(i)} className="edit-btn">✏️</button>
                                        <button onClick={() => handleDelete(i.id)} className="delete-btn">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="no-data">Không có dữ liệu nhập kho</td>
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

            {/* Modal Add/Edit */}
            {showAddBox && (
                <div className="modal-overlay" onClick={() => setShowAddBox(false)}>
                    <div className="form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h3>{isEditing ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}</h3>
                            <button className="close-btn" onClick={() => setShowAddBox(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSaveImport}>
                            <div className="form-modal-body">
                                <div className="form-group">
                                    <label>ID Nhà cung cấp</label>
                                    <input value={newImport.supplierId} onChange={e => handleNewChange("supplierId", e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Ngày nhập</label>
                                    <input type="date" value={newImport.importDate} onChange={e => handleNewChange("importDate", e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Tổng tiền</label>
                                    <input type="number" value={newImport.totalAmount} onChange={e => handleNewChange("totalAmount", e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input value={newImport.status} onChange={e => handleNewChange("status", e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <textarea value={newImport.note} onChange={e => handleNewChange("note", e.target.value)} />
                                </div>
                            </div>
                            <div className="form-modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowAddBox(false)}>Hủy</button>
                                <button type="submit" className="btn-save">{isEditing ? "Cập nhật" : "Lưu"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal thông báo */}
            {modal.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className={`modal-content modal-${modal.type}`} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            {modal.type === "success" && "✅"}
                            {modal.type === "error" && "❌"}
                        </div>
                        <h3 className="modal-title">{modal.title}</h3>
                        <p className="modal-message">{modal.message}</p>
                    </div>
                </div>
            )}
        </>
    );
}
