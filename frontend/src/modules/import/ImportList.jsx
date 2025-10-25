import React, { useEffect, useState } from "react";
import importService from "./importService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Customer-Employee.css";

export default function ImportList() {
    const [errors, setErrors] = useState({});
    const [imports, setImports] = useState([]);
    const [sortDate, setSortDate] = useState("asc");
    const [sortAmount, setSortAmount] = useState("asc");
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
    });

    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
    const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Cache supplier details to avoid repeated API calls
    const [supplierCache, setSupplierCache] = useState({});

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

    // Fetch supplier details by ID
    const fetchSupplierById = async (supplierId) => {
        // Check cache first
        if (supplierCache[supplierId]) {
            return supplierCache[supplierId];
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/suppliers/${supplierId}`);
            const supplierData = response.data;

            // Update cache
            setSupplierCache(prev => ({
                ...prev,
                [supplierId]: supplierData
            }));

            return supplierData;
        } catch (error) {
            console.error(`Error fetching supplier ${supplierId}:`, error);
            return null;
        }
    };

    // Enrich imports with supplier details
    const enrichImportsWithSupplierData = async (importsList) => {
        const enrichedImports = await Promise.all(
            importsList.map(async (importItem) => {
                if (importItem.supplier_id) {
                    const supplierData = await fetchSupplierById(importItem.supplier_id);
                    return {
                        ...importItem,
                        supplierName: supplierData?.name || 'N/A',
                        supplierCompany: supplierData?.companyName || 'N/A'
                    };
                }
                return {
                    ...importItem,
                    supplierName: 'N/A',
                    supplierCompany: 'N/A'
                };
            })
        );
        return enrichedImports;
    };

    // Search suppliers for dropdown
    const searchSuppliers = async (searchTerm) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/suppliers/search?name=${encodeURIComponent(searchTerm)}&page=0`
            );
            const data = await response.json();
            setSuppliers(data.content || []);
        } catch (error) {
            console.error('Error searching suppliers:', error);
            setSuppliers([]);
        }
    };

    // Debounce search
    useEffect(() => {
        if (supplierSearchTerm.length >= 2) {
            const timer = setTimeout(() => {
                searchSuppliers(supplierSearchTerm);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuppliers([]);
        }
    }, [supplierSearchTerm]);

    // Handle supplier selection
    const handleSelectSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setSupplierSearchTerm(supplier.companyName || supplier.name);
        setShowSupplierDropdown(false);
        handleNewChange("supplierId", supplier.supplier_id);
    };

    // Reset modal
    const handleCloseModal = () => {
        setShowAddBox(false);
        setSupplierSearchTerm('');
        setSelectedSupplier(null);
        setSuppliers([]);
        setShowSupplierDropdown(false);
    };

    // Fetch Imports
    const fetchImports = async () => {
        try {
            const data = await importService.getAll(page, 10);
            const enrichedData = await enrichImportsWithSupplierData(data.imports);
            setImports(enrichedData);
            setTotalItems(data.totalItems);
            setTotalPages(data.totalPages);
            setIsSearching(false);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhập kho:", err);
            showModal("❌ Lỗi", "Không thể tải danh sách nhập kho", "error");
        }
    };

    // Search by ID
    const handleSearchById = async () => {
        if (!searchId || searchId.trim() === "") {
            showModal("⚠️ Cảnh báo", "Vui lòng nhập ID cần tìm", "error");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/imports/${searchId}`);
            if (response.data) {
                const enrichedData = await enrichImportsWithSupplierData([response.data]);
                setImports(enrichedData);
                setIsSearching(true);
                setTotalPages(1);
                setTotalItems(1);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setImports([]);
            } else {
                showModal("❌ Lỗi", "Không thể tìm kiếm phiếu nhập", "error");
            }
            console.error("Search error:", err);
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchId("");
        setIsSearching(false);
        setPage(0);
        fetchImports();
    };

    useEffect(() => {
        fetchImports();
    }, [page]);

    const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
    const handleNewChange = (key, value) => setNewImport({ ...newImport, [key]: value });

    const handleEdit = (importItem) => {
        setIsEditing(true);
        setEditingId(importItem.importId);
        setNewImport({
            supplierId: importItem.supplier_id?.toString() || "",
            importDate: importItem.import_date || "",
            totalAmount: importItem.total_amount?.toString() || "",
            status: importItem.status || "",
            note: importItem.note || "",
        });

        // Pre-fill supplier search with company name
        if (importItem.supplierCompany && importItem.supplierCompany !== 'N/A') {
            setSupplierSearchTerm(importItem.supplierCompany);
            setSelectedSupplier({
                supplier_id: importItem.supplier_id,
                name: importItem.supplierName,
                companyName: importItem.supplierCompany
            });
        }

        setErrors({});
        setShowAddBox(true);
    };

    const handleSaveImport = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const payload = {
                supplier_id: parseInt(newImport.supplierId),
                import_date: newImport.importDate,
                total_amount: parseFloat(newImport.totalAmount),
                status: newImport.status,
                note: newImport.note,
            };

            if (isEditing) {
                await importService.update(editingId, payload);
                showModal("✓ Thành công", "Cập nhật phiếu nhập thành công!", "success");
            } else {
                await importService.create(payload);
                showModal("✓ Thành công", "Thêm mới phiếu nhập thành công!", "success");
            }

            setShowAddBox(false);
            setIsEditing(false);
            setEditingId(null);
            setNewImport({
                supplierId: "",
                importDate: "",
                totalAmount: "",
                status: "",
                note: "",
            });

            fetchImports();
        } catch (err) {
            console.error("Error saving import:", err);
            if (err.response?.status === 400 && err.response?.data?.details) {
                const backendErrors = err.response.data.details;
                const mappedErrors = {
                    supplierId: backendErrors.supplier_id,
                    importDate: backendErrors.import_date,
                    totalAmount: backendErrors.total_amount,
                    status: backendErrors.status,
                    note: backendErrors.note,
                };
                setErrors(mappedErrors);
            } else {
                showModal("❌ Lỗi", err.response?.data?.message || "Không thể lưu phiếu nhập", "error");
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá phiếu nhập này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/imports/${id}`);
            showModal("🗑️ Thành công", "Đã xoá phiếu nhập!", "success");
            fetchImports();
        } catch (error) {
            console.error("Delete error:", error);
            showModal("❌ Lỗi", error.response?.data?.message || "Xoá thất bại!", "error");
        }
    };

    const handleSortByDate = async () => {
        try {
            const startDate = "2000-01-01";
            const endDate = new Date().toISOString().split("T")[0];
            const newOrder = sortDate === "asc" ? "desc" : "asc";
            const data = await importService.filterByDate(startDate, endDate, newOrder);
            const enrichedData = await enrichImportsWithSupplierData(data);
            setImports(enrichedData);
            setSortDate(newOrder);
        } catch (err) {
            console.error("Sort error:", err);
            showModal("❌ Lỗi", "Không thể sắp xếp", "error");
        }
    };

    const handleSortByAmount = async () => {
        try {
            const minAmount = 0;
            const maxAmount = 999999999;
            const newOrder = sortAmount === "asc" ? "desc" : "asc";
            const data = await importService.filterByAmount(minAmount, maxAmount, newOrder);
            const enrichedData = await enrichImportsWithSupplierData(data);
            setImports(enrichedData);
            setSortAmount(newOrder);
        } catch (err) {
            console.error("Sort error:", err);
            showModal("❌ Lỗi", "Không thể sắp xếp", "error");
        }
    };

    const handlePageChange = (newPage) => setPage(newPage);

    const showModal = (title, message, type = "info") => {
        setModal({ isOpen: true, title, message, type });
        setTimeout(() => setModal({ isOpen: false, title: "", message: "", type: "info" }), 3000);
    };

    const closeModal = () => setModal({ isOpen: false, title: "", message: "", type: "info" });

    return (
        <>
            {/* Header */}
            <div className="header">
                <div className="header">
                    <div className="header-left">
                        <span className="header-icon">📥</span>
                        <h2 className="header-title">Quản lý nhập kho</h2>
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
                        <button onClick={() => navigate("/imports")} className="nav-btn active">
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
            </div>

            {/* Search and Filter Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '1rem',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flex: '1',
                    minWidth: '300px'
                }}>
                    <label style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>
                        🔍 Tìm theo ID:
                    </label>
                    <input
                        type="number"
                        placeholder="Nhập ID phiếu nhập..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchById();
                            }
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px',
                            minWidth: '180px',
                            flex: '1'
                        }}
                    />
                    <button onClick={handleSearchById} className="btn" style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}>
                        Tìm kiếm
                    </button>
                    {isSearching && (
                        <button onClick={handleClearSearch} className="btn" style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}>
                            ✕ Xóa bộ lọc
                        </button>
                    )}
                </div>

                <button
                    onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setNewImport({
                            supplierId: "",
                            importDate: "",
                            totalAmount: "",
                            status: "Pending",
                            note: "",
                        });
                        setErrors({});
                        setShowAddBox(true);
                    }}
                    className="btn add-btn"
                    style={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    ➕ Thêm mới
                </button>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID NCC</th>
                            <th>Tên công ty</th>
                            <th
                                style={{ cursor: "pointer", userSelect: "none" }}
                                onClick={handleSortByDate}
                            >
                                Ngày nhập{" "}
                                <span style={{ fontSize: "14px" }}>
                                    {sortDate === "asc" ? "▲" : "▼"}
                                </span>
                            </th>
                            <th
                                style={{ cursor: "pointer", userSelect: "none" }}
                                onClick={handleSortByAmount}
                            >
                                Tổng tiền{" "}
                                <span style={{ fontSize: "14px" }}>
                                    {sortAmount === "asc" ? "▲" : "▼"}
                                </span>
                            </th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imports.length > 0 ? imports.map(i => (
                            <tr key={i.importId}>
                                <td>{i.importId}</td>
                                <td>{i.supplier_id}</td>
                                <td>{i.supplierCompany}</td>
                                <td>{new Date(i.import_date).toLocaleDateString("vi-VN")}</td>
                                <td>{parseFloat(i.total_amount)?.toLocaleString("vi-VN")} ₫</td>
                                <td>
                                    <span className={`status-badge status-${i.status?.toLowerCase()}`}>
                                        {i.status}
                                    </span>
                                </td>
                                <td>{i.note}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleEdit(i)} className="edit-btn" title="Chỉnh sửa">
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(i.importId)} className="delete-btn" title="Xóa">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="no-data">Không có dữ liệu nhập kho</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0 || isSearching}>
                    ← Trước
                </button>
                <span>
                    {isSearching ? (
                        `Kết quả tìm kiếm: ${totalItems} phiếu`
                    ) : (
                        `Trang ${page + 1} / ${totalPages || 1} (${totalItems} phiếu)`
                    )}
                </span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1 || totalPages === 0 || isSearching}>
                    Sau →
                </button>
            </div>

            {/* Modal Add/Edit */}
            {showAddBox && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="form-modal-header">
                            <h3>{isEditing ? "Chỉnh sửa phiếu nhập" : "Thêm phiếu nhập mới"}</h3>
                            <button className="close-btn" onClick={handleCloseModal}>✕</button>
                        </div>
                        <form onSubmit={handleSaveImport}>
                            <div className="form-modal-body">
                                <div className="form-group">
                                    <label>Nhà cung cấp <span className="required">*</span></label>
                                    <div className="supplier-search-container" style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={supplierSearchTerm}
                                            onChange={(e) => {
                                                setSupplierSearchTerm(e.target.value);
                                                setShowSupplierDropdown(true);
                                            }}
                                            onFocus={() => setShowSupplierDropdown(true)}
                                            placeholder="Tìm kiếm nhà cung cấp theo tên..."
                                            required
                                            autoComplete="off"
                                        />

                                        {showSupplierDropdown && suppliers.length > 0 && (
                                            <div className="supplier-dropdown" style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                backgroundColor: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                marginTop: '4px',
                                                zIndex: 1000,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                {suppliers.map(supplier => (
                                                    <div
                                                        key={supplier.supplier_id}
                                                        className="supplier-item"
                                                        onClick={() => handleSelectSupplier(supplier)}
                                                        style={{
                                                            padding: '10px 12px',
                                                            cursor: 'pointer',
                                                            borderBottom: '1px solid #f0f0f0'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                                    >
                                                        <div style={{ fontWeight: '500' }}>{supplier.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                                            {supplier.companyName && `${supplier.companyName} - `}ID: {supplier.supplier_id}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {showSupplierDropdown && supplierSearchTerm.length >= 2 && suppliers.length === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 0,
                                                right: 0,
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                marginTop: '4px',
                                                color: '#999'
                                            }}>
                                                Không tìm thấy nhà cung cấp
                                            </div>
                                        )}
                                    </div>
                                    {selectedSupplier && (
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '8px',
                                            backgroundColor: '#f0f9ff',
                                            borderRadius: '4px',
                                            fontSize: '14px'
                                        }}>
                                            <strong>Đã chọn:</strong> {selectedSupplier.name} (ID: {selectedSupplier.supplier_id})
                                        </div>
                                    )}
                                    {errors.supplierId && <p className="error-text">{errors.supplierId}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Ngày nhập <span className="required">*</span></label>
                                    <input
                                        type="date"
                                        value={newImport.importDate}
                                        onChange={e => handleNewChange("importDate", e.target.value)}
                                        required
                                    />
                                    {errors.importDate && <p className="error-text">{errors.importDate}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Tổng tiền (₫) <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newImport.totalAmount}
                                        onChange={e => handleNewChange("totalAmount", e.target.value)}
                                        placeholder="Nhập tổng tiền"
                                        required
                                    />
                                    {errors.totalAmount && <p className="error-text">{errors.totalAmount}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Trạng thái <span className="required">*</span></label>
                                    <select
                                        value={newImport.status}
                                        onChange={e => handleNewChange("status", e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn trạng thái --</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && <p className="error-text">{errors.status}</p>}
                                </div>

                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <textarea
                                        value={newImport.note}
                                        onChange={e => handleNewChange("note", e.target.value)}
                                        placeholder="Nhập ghi chú (tùy chọn)"
                                        rows="3"
                                    />
                                    {errors.note && <p className="error-text">{errors.note}</p>}
                                </div>
                            </div>

                            <div className="form-modal-footer">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-save">
                                    {isEditing ? "Cập nhật" : "Lưu"}
                                </button>
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
                            {modal.type === "info" && "ℹ️"}
                        </div>
                        <h3 className="modal-title">{modal.title}</h3>
                        <p className="modal-message">{modal.message}</p>
                    </div>
                </div>
            )}
        </>
    );
}