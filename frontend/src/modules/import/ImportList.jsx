import React, { useEffect, useState } from "react";
import importService from "../import/importService";
import supplierService from "../import/supplierService";
import "../../styles/Customer-Employee.css";
import "../../styles/import.css";
import Header from "../import/Header";
import SearchAndFilter from "../import/SearchAndFilter";
import ImportTable from "../import/ImportTable";
import Pagination from "../import/Pagination";
import AddEditModal from "../import/AddEditModal";
import NotificationModal from "../import/NotificationModal";

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

    const [searchSupplierName, setSearchSupplierName] = useState("");
    const [searchSupplierId, setSearchSupplierId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [newImport, setNewImport] = useState({
        supplierId: "",
        supplierName: "",
        importDate: "",
        totalAmount: "",
        status: "",
        note: "",
    });

    const [supplierSuggestions, setSupplierSuggestions] = useState([]);
    const [showAddBox, setShowAddBox] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" });

    const [supplierNames, setSupplierNames] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // === Fetch Imports ===
    const fetchImports = async () => {
        try {
            const data = await importService.getAll(page, 10);
            setImports(data.imports);
            setTotalItems(data.totalItems);
            setTotalPages(data.totalPages);
            setIsSearching(false);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhập kho:", err);
            showModal("❌ Lỗi", "Không thể tải danh sách nhập kho", "error");
        }
    };

    // === Fetch Supplier Names ===
    useEffect(() => {
        const fetchSupplierNames = async () => {
            const uniqueIds = [...new Set(imports.map(i => i.supplier_id))].filter(id => id && !supplierNames[id]);
            if (uniqueIds.length === 0) return;

            try {
                const responses = await Promise.all(
                    uniqueIds.map(id => supplierService.getById(id))
                );
                const newNames = {};
                responses.forEach((supplier, index) => {
                    const id = uniqueIds[index];
                    newNames[id] = supplier.companyName || "Không xác định";
                });
                setSupplierNames(prev => ({ ...prev, ...newNames }));
            } catch (err) {
                console.error("Lỗi khi tải tên nhà cung cấp:", err);
                showModal("❌ Lỗi", "Không thể tải tên nhà cung cấp", "error");
            }
        };

        if (imports.length > 0) {
            fetchSupplierNames();
        }
    }, [imports]);

    // === Search by Supplier Name ===
    const handleSearchBySupplierName = async () => {
        if (!searchSupplierName || searchSupplierName.trim() === "") {
            showModal("⚠️ Cảnh báo", "Vui lòng nhập tên nhà cung cấp cần tìm", "error");
            return;
        }

        try {
            const suppliers = await supplierService.searchByName(searchSupplierName);
            if (suppliers.length === 0) {
                showModal("❌ Không tìm thấy", `Không tồn tại nhà cung cấp với tên: ${searchSupplierName}`, "error");
                setImports([]);
                return;
            }

            const supplierIds = suppliers.map(s => s.supplierId);
            const filteredImports = allImportsResponse.imports.filter(i => supplierIds.includes(i.supplier_id));

            if (filteredImports.length > 0) {
                setImports(filteredImports);
                setIsSearching(true);
                setTotalPages(1);
                setTotalItems(filteredImports.length);
            } else {
                showModal("❌ Không tìm thấy", `Không tồn tại phiếu nhập cho nhà cung cấp với tên: ${searchSupplierName}`, "error");
                setImports([]);
            }
        } catch (err) {
            showModal("❌ Lỗi", "Không thể tìm kiếm phiếu nhập", "error");
            console.error("Search error:", err);
        }
    };

    // === Search by Supplier ID ===
    const handleSearchBySupplierId = async () => {
        if (!searchSupplierId || searchSupplierId.trim() === "") {
            showModal("⚠️ Cảnh báo", "Vui lòng nhập ID nhà cung cấp cần tìm", "error");
            return;
        }

        try {
            const supplier = await supplierService.getById(searchSupplierId);
            if (!supplier) {
                showModal("❌ Không tìm thấy", `Không tồn tại nhà cung cấp với ID: ${searchSupplierId}`, "error");
                setImports([]);
                return;
            }

            const allImportsResponse = await importService.getAll(0, 1000);
            const filteredImports = allImportsResponse.imports.filter(i => i.supplier_id == searchSupplierId);

            if (filteredImports.length > 0) {
                setImports(filteredImports);
                setIsSearching(true);
                setTotalPages(1);
                setTotalItems(filteredImports.length);
            } else {
                showModal("❌ Không tìm thấy", `Không tồn tại phiếu nhập cho nhà cung cấp với ID: ${searchSupplierId}`, "error");
                setImports([]);
            }
        } catch (err) {
            showModal("❌ Lỗi", "Không thể tìm kiếm phiếu nhập", "error");
            console.error("Search error:", err);
        }
    };

    const handleClearSearch = () => {
        setSearchSupplierName("");
        setSearchSupplierId("");
        setFilters({
            startDate: "",
            endDate: "",
            minAmount: "",
            maxAmount: "",
        });
        setIsSearching(false);
        setPage(0);
        fetchImports();
    };

    useEffect(() => {
        fetchImports();
    }, [page]);

    const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
    const handleNewChange = (key, value) => setNewImport({ ...newImport, [key]: value });

    const handleSupplierSearch = async (e) => {
        const value = e.target.value;
        setNewImport({ ...newImport, supplierName: value, supplierId: "" });

        if (value.length >= 2) {
            try {
                const suggestions = await supplierService.searchByName(value);
                setSupplierSuggestions(suggestions);
            } catch (err) {
                console.error("Lỗi khi tìm kiếm nhà cung cấp:", err);
                showModal("❌ Lỗi", "Không thể tìm kiếm nhà cung cấp", "error");
            }
        } else {
            setSupplierSuggestions([]);
        }
    };

    const handleSelectSupplier = (supplier) => {
        setNewImport({
            ...newImport,
            supplierId: supplier.supplierId.toString(),
            supplierName: supplier.companyName,
        });
        setSupplierSuggestions([]);
    };

    const handleSaveImport = async (e) => {
        e.preventDefault();
        setErrors({});

        let hasError = false;
        const newErrors = {};

        if (!newImport.supplierId) {
            newErrors.supplierId = "Vui lòng chọn nhà cung cấp từ danh sách gợi ý";
            hasError = true;
        }

        const amount = parseFloat(newImport.totalAmount);
        if (isNaN(amount) || amount < 0) {
            newErrors.totalAmount = "Tổng tiền phải là số lớn hơn hoặc bằng 0";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        try {
            const payload = {
                supplier_id: parseInt(newImport.supplierId),
                import_date: newImport.importDate,
                total_amount: amount,
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
                supplierName: "",
                importDate: "",
                totalAmount: "",
                status: "",
                note: "",
            });
            setSupplierSuggestions([]);
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


    const handleEdit = async (importItem) => {
        let supplierName = supplierNames[importItem.supplier_id];
        if (!supplierName) {
            try {
                const supplier = await supplierService.getById(importItem.supplier_id);
                supplierName = supplier.companyName || "Không xác định";
                setSupplierNames(prev => ({ ...prev, [importItem.supplier_id]: supplierName }));
            } catch (err) {
                console.error("Lỗi khi tải tên nhà cung cấp cho chỉnh sửa:", err);
                supplierName = "Không xác định";
            }
        }

        setIsEditing(true);
        setEditingId(importItem.importId);
        setNewImport({
            supplierId: importItem.supplier_id?.toString() || "",
            supplierName: supplierName,
            importDate: importItem.import_date || "",
            totalAmount: importItem.total_amount?.toString() || "",
            status: importItem.status || "",
            note: importItem.note || "",
        });
        setErrors({});
        setShowAddBox(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        if (!deleteId) return;

        try {
            await importService.delete(deleteId);
            showModal("🗑️ Thành công", "Đã xoá phiếu nhập!", "success");
            fetchImports();
        } catch (error) {
            console.error("Delete error:", error);
            showModal("❌ Lỗi", error.response?.data?.message || "Xoá thất bại!", "error");
        } finally {
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    const handleSortByDate = async () => {
        try {
            const startDate = "2000-01-01";
            const endDate = new Date().toISOString().split("T")[0];
            const newOrder = sortDate === "asc" ? "desc" : "asc";
            const data = await importService.filterByDate(startDate, endDate, newOrder);
            setImports(data);
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
            setImports(data);
            setSortAmount(newOrder);
        } catch (err) {
            console.error("Sort error:", err);
            showModal("❌ Lỗi", "Không thể sắp xếp", "error");
        }
    };

    const handleFilterByDate = async () => {
        const { startDate, endDate } = filters;
        if (!startDate || !endDate) {
            showModal("⚠️ Cảnh báo", "Vui lòng nhập ngày bắt đầu và kết thúc", "error");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            showModal("⚠️ Cảnh báo", "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc", "error");
            return;
        }
        try {
            const data = await importService.filterByDate(startDate, endDate, sortDate);
            setImports(data);
            setIsSearching(true);
            setTotalPages(1);
            setTotalItems(data.length);
        } catch (err) {
            console.error("Filter error:", err);
            showModal("❌ Lỗi", "Không thể lọc theo ngày", "error");
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
            <Header />
            <SearchAndFilter
                searchSupplierName={searchSupplierName}
                setSearchSupplierName={setSearchSupplierName}
                searchSupplierId={searchSupplierId}
                setSearchSupplierId={setSearchSupplierId}
                handleSearchBySupplierName={handleSearchBySupplierName}
                handleSearchBySupplierId={handleSearchBySupplierId}
                isSearching={isSearching}
                handleClearSearch={handleClearSearch}
                setShowAddBox={setShowAddBox}
                setIsEditing={setIsEditing}
                setEditingId={setEditingId}
                setNewImport={setNewImport}
                setErrors={setErrors}
                setSupplierSuggestions={setSupplierSuggestions}
            />
            <div className="filter-section">
                <label>Ngày bắt đầu:</label>
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <label>Ngày kết thúc:</label>
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
                <button onClick={handleFilterByDate}>Lọc theo ngày</button>
            </div>
            <ImportTable
                imports={imports}
                supplierNames={supplierNames}
                handleSortByDate={handleSortByDate}
                sortDate={sortDate}
                handleSortByAmount={handleSortByAmount}
                sortAmount={sortAmount}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                isSearching={isSearching}
                handlePageChange={handlePageChange}
            />
            <AddEditModal
                showAddBox={showAddBox}
                setShowAddBox={setShowAddBox}
                isEditing={isEditing}
                newImport={newImport}
                handleSupplierSearch={handleSupplierSearch}
                errors={errors}
                supplierSuggestions={supplierSuggestions}
                handleSelectSupplier={handleSelectSupplier}
                handleNewChange={handleNewChange}
                handleSaveImport={handleSaveImport}
            />
            <NotificationModal modal={modal} closeModal={closeModal} />
            {showDeleteConfirm && (
                <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h2>Xác nhận xoá</h2>
                        <p>Bạn có chắc muốn xoá phiếu nhập này?</p>
                        <button onClick={confirmDelete} style={{ marginRight: '10px' }}>Có</button>
                        <button onClick={cancelDelete}>Không</button>
                    </div>
                </div>
            )}
        </>
    );
}