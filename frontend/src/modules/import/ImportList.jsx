
import React, { useEffect, useState } from "react";
import importService from "../import/importService";
import axios from "axios";
import "../../styles/Customer-Employee.css"
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
                    uniqueIds.map(id => axios.get(`http://localhost:8080/api/suppliers/${id}`))
                );
                const newNames = {};
                responses.forEach((res, index) => {
                    const id = uniqueIds[index];
                    newNames[id] = res.data.companyName || "Không xác định";
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
            // First, search for suppliers by name
            const supplierResponse = await axios.get(`http://localhost:8080/api/suppliers/search?name=${encodeURIComponent(searchSupplierName)}`);
            const suppliers = supplierResponse.data.data || [];
            if (suppliers.length === 0) {
                showModal("❌ Không tìm thấy", `Không tồn tại nhà cung cấp với tên: ${searchSupplierName}`, "error");
                setImports([]);
                return;
            }

            // Get list of supplier IDs
            const supplierIds = suppliers.map(s => s.supplierId);

            // Now, fetch all imports and filter by supplier_id (client-side filter, assuming no server-side endpoint for this)
            // Note: For efficiency, consider adding a backend endpoint like /api/imports/search?supplierIds=1,2,3
            const allImportsResponse = await importService.getAll(0, 1000); // Fetch more to filter, adjust as needed
            const filteredImports = allImportsResponse.imports.filter(i => supplierIds.includes(i.supplier_id));

            if (filteredImports.length > 0) {
                setImports(filteredImports);
                setIsSearching(true);
                setTotalPages(1); // Since filtering client-side, no pagination
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

    // === Clear search and reload all ===
    const handleClearSearch = () => {
        setSearchSupplierName("");
        setIsSearching(false);
        setPage(0);
        fetchImports();
    };

    useEffect(() => {
        fetchImports();
    }, [page]);

    // === Handlers ===
    const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });
    const handleNewChange = (key, value) => setNewImport({ ...newImport, [key]: value });

    const handleSupplierSearch = async (e) => {
        const value = e.target.value;
        setNewImport({ ...newImport, supplierName: value, supplierId: "" }); // Reset ID when typing

        if (value.length >= 2) {
            try {
                const response = await axios.get(`http://localhost:8080/api/suppliers/search?name=${encodeURIComponent(value)}`);
                setSupplierSuggestions(response.data.data || []);
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

    const handleEdit = async (importItem) => {
        let supplierName = supplierNames[importItem.supplier_id];
        if (!supplierName) {
            try {
                const res = await axios.get(`http://localhost:8080/api/suppliers/${importItem.supplier_id}`);
                supplierName = res.data.companyName || "Không xác định";
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

    const handleSaveImport = async (e) => {
        e.preventDefault();
        setErrors({}); // reset lỗi cũ

        let hasError = false;
        const newErrors = {};

        if (!newImport.supplierId) {
            newErrors.supplierName = "Vui lòng chọn nhà cung cấp từ danh sách gợi ý";
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
            // ✅ Convert frontend camelCase to backend snake_case
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

            // Reset form
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

            fetchImports(); // load lại danh sách
        } catch (err) {
            console.error("Error saving import:", err);
            if (err.response?.status === 400 && err.response?.data?.details) {
                // ✅ Map backend snake_case errors to frontend camelCase
                const backendErrors = err.response.data.details;
                const mappedErrors = {
                    supplierName: backendErrors.supplier_id,
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

    // ✅ Delete function
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
                handleSearchBySupplierName={handleSearchBySupplierName}
                isSearching={isSearching}
                handleClearSearch={handleClearSearch}
                setShowAddBox={setShowAddBox}
                setIsEditing={setIsEditing}
                setEditingId={setEditingId}
                setNewImport={setNewImport}
                setErrors={setErrors}
                setSupplierSuggestions={setSupplierSuggestions}
            />
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
        </>
    );
}